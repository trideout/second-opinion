import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import useListRef from './useListRef';

type Message = {
  id: string,
  content: string,
  author: string,
  timestamp: number,
  urgency: 1 | 2 | 3,
}

type User = {
  id: string,
  name: string,
}

let totalMessages = 6;
function getMessageId() {
  return `message-${++totalMessages}`
}

function getRandomUrgency() {
  return Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3
}

export function Chat() {
  const currentUserId = 'user-2'

  const users: User[] = useMemo(() => [
    {
      id: "user-1",
      name: "Client",
    },
    {
      id: 'user-2',
      name: "Therapist",
    }
  ], [])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: `message-1`,
      content: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
      author: 'user-1',
      timestamp: Date.now() - 1000 * 60 * 8,
      urgency: getRandomUrgency(),
    },
    {
      id: `message-2`,
      content: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
      author: 'user-2',
      timestamp: Date.now() - 1000 * 60 * 7,
      urgency: getRandomUrgency(),
    },
    {
      id: `message-3`,
      content: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
      author: 'user-1',
      timestamp: Date.now() - 1000 * 60 * 6,
      urgency: getRandomUrgency(),
    },
    {
      id: `message-4`,
      content: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
      author: 'user-1',
      timestamp: Date.now() - 1000 * 60 * 5,
      urgency: getRandomUrgency(),
    },
    {
      id: `message-5`,
      content: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
      author: 'user-2',
      timestamp: Date.now() - 1000 * 60 * 4,
      urgency: getRandomUrgency(),
    },
    {
      id: `message-6`,
      content: `I'm baby hashtag tonx DIY iPhone street art. Af grailed four loko XOXO air plant ugh thundercats chillwave sustainable austin keffiyeh tilde.`,
      author: 'user-1',
      timestamp: Date.now() - 1000 * 60 * 3,
      urgency: getRandomUrgency(),
    },
  ]);

  const scrollAnchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAnchor.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, scrollAnchor]) 
  
  const mainRef = useRef<HTMLDivElement>(null);
  
  const { gradientRef, messageRef } = useUrgencyGradient({ messages, mainRef, currentUserId })

  return (
    <div className="flex flex-col w-full min-h-full">
      <header className="flex items-center h-16 px-4 border-b bg-beige-200">
        <div className="flex items-center gap-2">
          <img src="/logo-icon.png" className="w-10 h-10" />
          {/* <IconArrowleft className="w-6 h-6 text-gray-500" /> */}
          <div className="flex flex-col">
            <h2 className="font-semibold">Client</h2>
            <span className="text-xs text-gray-500">Online</span>
          </div>
        </div>
      </header>
      <main ref={mainRef} className="relative flex flex-col flex-1 gap-4 px-4 py-6 overflow-y-auto bg-white">
        <div className="absolute top-0 bottom-0 left-0 w-1.5 h-full" ref={gradientRef}></div>
        {messages.map(({ id, content, author, timestamp, urgency }) => (
          <div
            // @ts-expect-error
            ref={messageRef}
            key={id}
            id={id}
            className={clsx(
              'flex items-end gap-2',
              author === currentUserId && 'ml-auto flex-row-reverse',
            )}
          >
            <div className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center font-bold uppercase',
              author === currentUserId
                ? 'bg-primary-200 text-primary-800'
                : 'bg-gray-200 text-gray-800'
            )}>
              {users.find(user => user.id === author)?.name[0]}
            </div>
            <div className={clsx(
              'p-2 max-w-[70%]',
              author === currentUserId
                ? 'bg-primary-100 text-primary-1000 rounded-md rounded-br-none'
                : 'bg-gray-100 text-gray-900 rounded-md rounded-bl-none'
            )}>
              <p className="text-sm">{content}</p>
              <p className={clsx(
                'text-xs mt-2',
                author === currentUserId ? 'text-primary-700' : 'text-gray-600'
              )}>
                {
                  new Intl.DateTimeFormat('en-us', {
                    weekday: 'short',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  }).format(timestamp)
                }
              </p>
            </div>
            {
              author !== currentUserId && (
                <div className="flex flex-col items-center justify-start min-h-full gap-2 py-2">
                  <div className={clsx(
                    'w-3 h-3 rounded-full',
                    (() => {
                      switch (urgency) {
                        case 1:
                          return 'bg-green-500'
                        case 2:
                          return 'bg-yellow-500'
                        case 3:
                          return 'bg-red-500'
                      }
                    })()
                  )}></div>
                </div>
              )
            }
          </div>
        ))}
        <div ref={scrollAnchor}></div>
      </main>
      <ChatFooter
        onNewMessage={
          newMessage => setMessages(previous => [
            ...previous,
            newMessage
          ].sort((a, b) => a.timestamp - b.timestamp))
        }
      />
    </div>
  )
}

function ChatFooter({ onNewMessage }: { onNewMessage: (newMessage: Message) => void }) {
  const [content, setContent] = useState('');
  const input = useRef<HTMLTextAreaElement>(null);

  function handleNewMessage() {
    onNewMessage({
      id: getMessageId(),
      content,
      author: Math.random() < 0.75 ? 'user-1' : 'user-2',
      timestamp: Date.now(),
      urgency: getRandomUrgency(),
    })

    setContent('')

    // @ts-expect-error
    input.current.style.height = 'auto'
  }

  return (
    <footer className="flex items-center flex-shrink-0 gap-2 px-4 py-2 border-t min-h-16 bg-beige-200">
        <textarea
          ref={input}
          className="w-full overflow-y-scroll border-0 rounded-md resize-none ring-1 ring-primary-700 h-[calc(1.5em+1rem)] max-h-[6em]"
          placeholder="Type a message..."
          rows={1}
          value={content}
          onInput={(event) => {
            const input = event.target as HTMLTextAreaElement
            input.style.height = 'auto'
            input.style.height = `${input.scrollHeight}px`
            setContent(input.value)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && event.metaKey) {
              event.preventDefault()
              handleNewMessage()
            }
          }}
        />
        <button
          type="button"
          onClick={handleNewMessage}
          className="flex items-center justify-center w-10 h-10 p-2 transition rounded-full select-none text-primary-50 bg-primary-700 disabled:opacity-60"
          disabled={!content}
        >
          <IconSend />
        </button>
      </footer>
  )
}

function IconArrowleft(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}


function IconSend(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  )
}

/**
 * Applies a linear gradient that spans the height of the chat,
 * transitioning its color based on the urgency of the messages
 */
function useUrgencyGradient({ messages, mainRef, currentUserId }) {
  const [messageElements, messageRef] = useListRef();
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Iterate over the message elements to get their top and bottom positions.
    // This will be used to calculate the gradient stops
    // @ts-expect-error
    const tops = messageElements.current
      .filter((_, index) => messages[index].author !== currentUserId)
      .map(element => element.getBoundingClientRect().top)

    const mainRefHeight = mainRef.current.offsetHeight

    // Calculate the gradient stops based on the tops. Each color stop should start at the top of the current message and end at the top of the next message
    const stops = tops.map((top) => {
      const topPercentage = (top / mainRefHeight) * 100
      return `${topPercentage}%`
    })

    // Calculate the gradient colors based on the urgency of the messages
    const colors = messages.map(({ urgency }) => {
      switch (urgency) {
        case 0:
          return 'white'
        case 1:
          return 'rgb(34 197 94)'
        case 2:
          return 'rgb(234 179 8)'
        case 3:
          return 'rgb(239 68 68)'
      }
    })

    // format the gradient string
    let linearGradient = `linear-gradient(to bottom, white 0%, `
    for (let i = 0; i < stops.length; i++) {
      linearGradient += `${colors[i]} ${stops[i]}, `
    }
    linearGradient += `${colors[colors.length - 1]} 100%)`

    console.log(linearGradient)

    // Apply the gradient
    // @ts-expect-error
    gradientRef.current.style.backgroundImage = linearGradient
  }, [messages, currentUserId])

  return { gradientRef, messageRef }
}
