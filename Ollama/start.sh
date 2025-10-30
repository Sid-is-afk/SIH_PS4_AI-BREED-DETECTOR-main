#!/bin/sh

# This line starts the main Ollama server in the background
/bin/ollama serve &

# Capture the process ID of the server
pid=$!

# Wait for a moment to ensure the server is up
sleep 5

# Now, pull the model (you can change 'llama3:8b' to your preferred model)
ollama pull llama3:8b

# Wait for the server process to exit, which keeps the container running
wait $pid