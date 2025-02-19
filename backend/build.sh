#!/usr/bin/env bash
# exit on error
set -o errexit

# Add the backend directory to PYTHONPATH
export PYTHONPATH="/opt/render/project/src/backend:$PYTHONPATH"

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate