# Use the official Ollama Docker image
FROM ollama/ollama

# Copy your new startup script into the container at the root
COPY start.sh /start.sh

# Make the script executable
RUN chmod +x /start.sh

# When the container starts, it will now run your script
ENTRYPOINT [ "/start.sh" ]