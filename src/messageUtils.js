export function isDelivered(message) {
  message.deliveredTo.push(localStorage.getItem('id'));

  for (let i = 0; i < message.forUsers.length; i++) {
    if (!message.deliveredTo.includes(message.forUsers[i])) {
      return false;
    }
  }

  return true;
}

export function isLastSeen(message, props) {    
  for (let i = props.messages.length - 1; i >= 0; i--) {
    if (isSeen(props.messages[i])) {
      if (props.messages[i]._id !== message._id) {
        return false;
      } else {
        return true;
      }
    }
  }

  return false;
}

export function isSeen(message) {
  if (!message.seenBy) message.seenBy = [];

  if (!message.seenBy.includes(message.sentBy)) {
    message.seenBy.push(message.sentBy);    
  }
  
  for (let i = 0; i < message.forUsers.length; i++) {
    if (!message.seenBy.includes(message.forUsers[i])) {
      return false;
    }
  }

  return true;
}