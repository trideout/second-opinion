import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import useListRef from './useListRef';
import { nanoid } from 'nanoid';

type Message = {
  id: number,
  content: string,
  author: string,
  timestamp: number,
  status: 0 | 1 | 2,
  analysis: {
    value?: number,
    reasoning?: string,
  }
}

type User = {
  id: string,
  name: string,
}

function getMessageId() {
  return -1 * Math.floor(Math.random() * 1000);
}

export function Chat() {
  const users: User[] = useMemo(() => [
    {
      id: "client",
      name: "Client",
    },
    {
      id: 'therapist',
      name: "Therapist",
    }
  ], [])

  const [messages, setMessages] = useMessages(); 

  const [currentUserId, setCurrentUserId] = useState('');
  const isTherapist = users.find(user => user.id === currentUserId)?.name === 'Therapist';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isTherapist = params.get('user') === 'therapist';
    setCurrentUserId(isTherapist ? 'therapist' : 'client');
  }, [])

  const scrollAnchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAnchor.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, scrollAnchor]) 
  
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const { gradientRef, messageRef } = useUrgencyGradient({ isTherapist, messages, messageContainerRef, currentUserId })

  const [drawerMessage, setDrawerMessage] = useState<Message | null>(null);

  const channel = useBroadcastChannel({
    onMessage: (message) => {
      setMessages(previous => {
        const existing = previous.find(({ content }) => content === message.content)

        if (existing) {
          // analysis came in
          return previous.map(m => {
            return m.content === existing.content ? message : m
          })
        }

        return [
          ...previous,
          message
        ].sort((a, b) => a.timestamp - b.timestamp)
      })
    }
  });

  return (
    <div className="flex flex-col w-full min-h-full">
      <header className="flex items-center h-16 px-4 border-b bg-beige-200">
        <div className="flex items-center w-full gap-2">
          <img src="/logo-icon.png" className="w-10 h-10" />
          <div className="flex flex-col">
            <h2 className="font-semibold">{isTherapist ? 'Live chat with Client' : 'Live chat with Therapist'}</h2>
            <span className="text-xs text-gray-500">Online</span>
          </div>
          <div className="flex items-center justify-center w-10 h-10 ml-auto text-lg font-bold rounded-full bg-beige-300 text-primary-800">
            {isTherapist ? 'T' : 'C'}
          </div>
        </div>
      </header>
      <main
        className="relative flex flex-col flex-1 gap-4 overflow-x-hidden overflow-y-auto bg-white"
      >
        <div ref={messageContainerRef} className="relative flex flex-col gap-4 px-4 py-6 ">
          {isTherapist && <div className="absolute top-0 bottom-0 left-0 w-1.5 h-full" ref={gradientRef}></div>}
          {messages.map((message) => {
            const { id, content, author, timestamp, analysis } = message 
            return (
              <div
                // @ts-expect-error
                ref={messageRef}
                key={id}
                id={`${id}`}
                className={clsx(
                  'flex items-end gap-2',
                  author === currentUserId && 'flex-row-reverse',
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
                  author !== currentUserId && isTherapist && (
                    <div className="flex flex-col items-center justify-start min-h-full gap-2 py-2">
                      {/* @ts-expect-error */}
                      {(console.log(analysis), analysis?.value > -1)
                        ? (
                          <button type="button" onClick={() => {
                            setDrawerMessage(message)
                          }} className={clsx(
                            'w-4 h-4 rounded-full',
                            (() => {
                              switch (analysis.value) {
                                case 0:
                                  return 'bg-white ring-inset ring-2 ring-gray-400'
                                case 1:
                                  return 'bg-green-500'
                                case 2:
                                  return 'bg-yellow-500'
                                case 3:
                                  return 'bg-red-500'
                              }
                            })()
                          )}></button>
                        )
                        : (
                          <svg className="w-4 h-4 mr-3 -ml-1 text-gray-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )
                      }
                    </div>
                  )
                }
              </div>
            )
          })}
        </div>
        <div ref={scrollAnchor}></div>
        <ChatDrawer
          message={drawerMessage}
          close={() => setDrawerMessage(null)}
          onChange={({ message, opinion }) => {
            setMessages(previous => previous.map(m => {
              return m.id === message.id ? {
                ...m,
                analysis: {
                  value: -1,
                  reasoning: 'Loading'
                },
              } : m
            }))
            
            setTimeout(() => {
              ;(async () => {
                await fetch('/api/opinions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    message_id: message.id,
                    message: message.content,
                    urgency: opinion,
                  })
                })
          
                const newMessage = await getMessage(message.id)
          
                setMessages(previous => previous.map(m => {
                  return m.id === message.id ? {
                    ...m,
                    analysis: {
                      value: Number(newMessage.analysis.interpreted_value),
                      reasoning: newMessage.analysis.llm_reasoning,
                    },
                  } : m
                }))
              })()
            }, 50)
        
            setDrawerMessage(null)
          }}
        />
      </main>
      <ChatFooter
        currentUserId={currentUserId}
        onNewMessage={
          newMessage => {
            channel.current?.postMessage(newMessage)
            
            setMessages(previous => [
              ...previous,
              newMessage
            ].sort((a, b) => a.timestamp - b.timestamp))

            if (isTherapist) {
              return
            }

            ;(async () => {
              const json = await sendMessage(newMessage)

              const message = await getMessage(json.id)

              channel.current?.postMessage({
                id: message.id,
                author: 'client',
                content: message.message_text,
                status: message.analysis_status, 
                timestamp: new Date(message.created_at).getTime(),
                analysis: message.analysis
                  ? {
                    value: Number(message.analysis.raw_response),
                    reasoning: message.analysis.llm_reasoning,
                  }
                  : {
                    value: 0,
                    reasoning: 'Error while processing message',
                  },
              })
            })()
          }
        }
      />
    </div>
  )
}

function ChatDrawer({ message, close, onChange }: { message: Message | null, close: () => void, onChange: Function }) {
  const { id, analysis: { value, reasoning } } = message || { analysis: {} }
  
  const opinions = [1, 2, 3].filter(opinion => opinion !== value)

  async function storeOpinion(opinion: number) {
    if (typeof id !== 'number') {
      return
    }

    onChange({ message, opinion })
  }

  return (
    <div className={clsx(
      'fixed bottom-0 left-0 right-0 z-10 p-4 bg-white shadow-lg h-[calc(42vh)] w-screen transition duration-150 ease-in-out border-t border-gray-3000',
      reasoning ? 'translate-y-0' : 'translate-y-full',
    )}>
      <div className="relative flex flex-col w-full max-h-full">
        <button
          type="button"
          onClick={close}
          className="absolute top-0 right-0 w-10 h-10 text-gray-900 transition rounded-full select-none"
        >
          <IconX />
        </button>
        <div className="flex flex-col flex-1 gap-4 p-4 overflow-y-scroll">
          <h3 className="text-lg font-semibold">📝 Second opinion</h3>
          <p className="text-sm">{reasoning}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            type="button"
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-primary-200 text-primary-950"
            onClick={close}
          >
            <span>I agree</span>
            <IconCheck className="w-4 h-4" />
          </button>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm">I disagree, I think this message is:</p>
            <div className="flex items-center justify-center w-full gap-2">
              {opinions.map(opinion => (
                <button
                  key={opinion}
                  type="button"
                  className={clsx(
                    'flex items-center px-3 py-1.5 text-sm rounded-full',
                    (() => {
                      switch (opinion) {
                        case 1:
                          return 'bg-green-100 text-green-950'
                        case 2:
                          return 'bg-yellow-100 text-yellow-950'
                        case 3:
                          return 'bg-red-100 text-red-950'
                      }
                    })()
                  )}
                  onClick={() => storeOpinion(opinion)}
                >
                  {
                    (() => {
                      switch (opinion) {
                        case 1:
                          return 'Not urgent'
                        case 2:
                          return 'Somewhat urgent'
                        case 3:
                          return 'Urgent'
                      }
                    })()
                  }
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChatFooter({ onNewMessage, currentUserId }: { onNewMessage: (newMessage: Message) => void, currentUserId: string }) {
  const [content, setContent] = useState('');
  const input = useRef<HTMLTextAreaElement>(null);

  function handleNewMessage() {
    if (!content) {
      return
    }

    onNewMessage({
      id: getMessageId(),
      content,
      author: currentUserId,
      timestamp: Date.now(),
      status: 0,
      analysis: {
        value: -1,
        reasoning: 'Loading',
      },
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
            if (event.key === 'Enter') {
              event.preventDefault()
              handleNewMessage()
            }
          }}
        />
        <button
          type="button"
          onClick={handleNewMessage}
          className="flex items-center justify-center w-10 h-10 p-2 transition rounded-full select-none text-primary-50 bg-primary-700"
        >
          <IconSend />
        </button>
      </footer>
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
function useUrgencyGradient({ isTherapist, messages, messageContainerRef, currentUserId }) {
  const [messageElements, messageRef] = useListRef();
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTherapist || !messages.length) {
      return
    }

    // @ts-expect-error
    const positions = messageElements.current
      .filter((_, index) => messages[index].author !== currentUserId)
      .map(element => {
        const { top, bottom } = element.getBoundingClientRect()
        return { top, bottom }
      })      

    const { top: messageContainerTop, height: messageContainerHeight } = messageContainerRef.current.getBoundingClientRect()

    // Calculate the gradient stops based on the tops. Each color should start at the top of the current message and end at the top of the next message
    const stops = positions.reduce((stops, { top, bottom }, index) => {
      const topPercentage = ((top - messageContainerTop) / messageContainerHeight) * 100
      const bottomPercentage = ((bottom - messageContainerTop) / messageContainerHeight) * 100
      const analysisValue = messages.filter(({ author }) => author !== currentUserId)[index].analysis?.value
      const color = (() => {
        switch (analysisValue) {
          case 0:
            return 'white'
          case 1:
            return 'rgb(34,197,94)'
          case 2:
            return 'rgb(234,179,8)'
          case 3:
            return 'rgb(239,68,68)'
          default:
            return 'rgb(228,228,231)'
        }
      })()

      stops.push(`${color} ${topPercentage}%`, `${color} ${bottomPercentage}%`)

      return stops
    }, [] as string[])

    // format the gradient string
    const linearGradient = `linear-gradient(to bottom, white 0%, ${stops.join(', ')}, white 100%)`
    
    // Apply the gradient
    // @ts-ignore
    gradientRef.current.style.backgroundImage = linearGradient
  }, [messages, currentUserId, isTherapist])

  return { gradientRef, messageRef }
}

function IconX(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

async function getMessages() {
  const response = await fetch('/api/messages');
  const json = await response.json();

  return json.map(({ id, message_text, created_at, analysis_status, analysis }) => ({
    id,
    author: 'client',
    content: message_text,
    status: analysis_status, 
    timestamp: new Date(created_at).getTime(),
    analysis: analysis
      ? {
        value: Number(analysis.interpreted_value !== '0' ? analysis.interpreted_value : analysis.raw_response),
        reasoning: analysis.llm_reasoning,
      }
      : {
        value: 0,
        reasoning: 'Error while processing message',
      },
  }));
}

function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    (async () => {
      const messages = await getMessages();
      setMessages(messages);
    })()
  }, [])

  return [messages, setMessages] as const
}

async function sendMessage(message: Message) {
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message_text: message.content,
    }),
  })

  const json = await response.json();

  return json;
}

async function getMessage(id: number) {
  const response = await fetch(`/api/messages/${id}`);
  const json = await response.json();

  return json;
}

function useBroadcastChannel({ onMessage }: { onMessage?: (message: Message) => void}) {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;
  const channel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channel.current = new BroadcastChannel('second opinion');
    
    channel.current.onmessage = (event) => {
      const message = event.data as Message;
      onMessageRef.current?.(message);
    }

    return () => {
      channel.current?.close();
    }
  }, [onMessageRef])

  return channel
}

function IconCheck(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props} >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>

  )

}
