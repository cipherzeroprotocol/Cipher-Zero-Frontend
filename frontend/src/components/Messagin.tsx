import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';

// Styled components
const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Timestamp = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

// Define types for message and props
interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string; // ISO string
}

interface MessagingProps {
  apiEndpoint: string; // API endpoint for messaging
  websocketEndpoint: string; // WebSocket endpoint for real-time updates
}

const Messagin: React.FC<MessagingProps> = ({ apiEndpoint, websocketEndpoint }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null); // For auto-scrolling

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(apiEndpoint);
        setMessages(response.data);
      } catch (err) {
        setError('Failed to fetch messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [apiEndpoint]);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket(websocketEndpoint);

    ws.onmessage = (event) => {
      const newMessage: Message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error.');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setSocket(null);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [websocketEndpoint]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post(apiEndpoint, { content: newMessage });
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message.');
    }
  };

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  // Auto-scroll to the bottom of the message list
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <List>
        {messages.map((message) => (
          <React.Fragment key={message.id}>
            <StyledListItem>
              <ListItemText
                primary={message.content}
                secondary={
                  <>
                    <Typography variant="body2" color="textPrimary">
                      From: {message.sender}
                    </Typography>
                    <Timestamp variant="caption">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </Timestamp>
                  </>
                }
              />
            </StyledListItem>
            <Divider />
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} /> {/* For auto-scrolling */}
      </List>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <TextField
          label="Type your message"
          variant="outlined"
          fullWidth
          value={newMessage}
          onChange={handleMessageChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          style={{ marginLeft: '10px' }}
        >
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Messagin;
