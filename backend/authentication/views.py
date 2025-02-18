from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserSerializer
from .models import WishlistItem
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def login_view(request):
    login_identifier = request.data.get('login')  # This can be either email or username
    password = request.data.get('password')

    if not login_identifier or not password:
        return Response({
            'status': 'error',
            'message': 'Please provide all required fields'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        # First try to get user by email
        if '@' in login_identifier:
            user = User.objects.get(email=login_identifier)
            username = user.username
        else:
            # If no @ symbol, treat as username
            username = login_identifier

        # Authenticate with username
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'status': 'success',
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            })
        else:
            return Response({
                'status': 'error',
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except User.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'User not found'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['PUT'])
def update_profile(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
    
    user = request.user
    username = request.data.get('username')
    
    if username:
        user.username = username
        user.save()
    
    return Response({
        'status': 'success',
        'user': UserSerializer(user).data
    }) 

@api_view(['POST'])
def signup_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    # Validate input
    if not all([username, email, password]):
        return Response({
            'status': 'error',
            'message': 'Please provide all required fields'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Check if user already exists
    if User.objects.filter(username=username).exists():
        return Response({
            'status': 'error',
            'message': 'Username already taken'
        }, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({
            'status': 'error',
            'message': 'Email already registered'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Create new user
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        refresh = RefreshToken.for_user(user)
        return Response({
            'status': 'success',
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST) 

@api_view(['GET'])
def search_users(request):
    query = request.GET.get('q', '')
    if not query:
        return Response([])
    
    # Get current user's ID from the token
    current_user = request.user
    
    # Exclude current user from search results
    users = User.objects.filter(username__icontains=query).exclude(id=current_user.id)[:5]
    return Response(UserSerializer(users, many=True).data) 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        # Get user's wishlist items
        wishlist_items = WishlistItem.objects.filter(user=user)
        wishlist_ids = list(wishlist_items.values_list('product_id', flat=True))
        
        logger.info(f"Found wishlist items for user {user.username}: {wishlist_ids}")
        
        return Response({
            'status': 'success',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            },
            'wishlist': wishlist_ids
        })
    except User.DoesNotExist:
        logger.error(f"User with ID {user_id} not found")
        return Response({
            'status': 'error',
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error in user_profile: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_wishlist(request):
    if request.method == 'GET':
        wishlist_items = WishlistItem.objects.filter(user=request.user)
        return Response({
            'status': 'success',
            'wishlist': [{
                'id': item.id,
                'title': item.title,
                'description': item.description,
                'created_at': item.created_at
            } for item in wishlist_items]
        })
    
    elif request.method == 'POST':
        title = request.data.get('title')
        description = request.data.get('description', '')
        
        if not title:
            return Response({
                'status': 'error',
                'message': 'Title is required'
            }, status=400)
            
        item = WishlistItem.objects.create(
            user=request.user,
            title=title,
            description=description
        )
        
        return Response({
            'status': 'success',
            'message': 'Added to wishlist',
            'item': {
                'id': item.id,
                'title': item.title,
                'description': item.description,
                'created_at': item.created_at
            }
        })
    
    elif request.method == 'DELETE':
        item_id = request.data.get('id')
        WishlistItem.objects.filter(
            user=request.user,
            id=item_id
        ).delete()
        return Response({
            'status': 'success',
            'message': 'Removed from wishlist'
        }) 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_wishlist(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        wishlist = WishlistItem.objects.filter(user=user)
        
        return Response({
            'username': user.username,
            'wishes': [item.title for item in wishlist if item.title]
        })
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=404)