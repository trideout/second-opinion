function getRandomUrgency() {
  return Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3
}

export const messages = [
  {
    id: `message-1`,
    content: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
    author: 'user-1',
    timestamp: Date.now() - 1000 * 60 * 8,
    urgency: getRandomUrgency(),
    urgencyJustification: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
  },
  {
    id: `message-2`,
    content: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
    author: 'user-2',
    timestamp: Date.now() - 1000 * 60 * 7,
    urgency: getRandomUrgency(),
    urgencyJustification: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
  },
  {
    id: `message-3`,
    content: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
    author: 'user-1',
    timestamp: Date.now() - 1000 * 60 * 6,
    urgency: getRandomUrgency(),
    urgencyJustification: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
  },
  {
    id: `message-4`,
    content: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
    author: 'user-1',
    timestamp: Date.now() - 1000 * 60 * 5,
    urgency: getRandomUrgency(),
    urgencyJustification: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
  },
  {
    id: `message-5`,
    content: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
    author: 'user-2',
    timestamp: Date.now() - 1000 * 60 * 4,
    urgency: getRandomUrgency(),
    urgencyJustification: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
  },
  {
    id: `message-6`,
    content: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
    author: 'user-1',
    timestamp: Date.now() - 1000 * 60 * 3,
    urgency: getRandomUrgency(),
    urgencyJustification: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
  },
];
