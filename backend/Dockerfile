FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Setting Environment Variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        gcc \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy Project Files
COPY . .

# Exposed Ports
EXPOSE 8000

# Startup Command
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"] 