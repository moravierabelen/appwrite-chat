import { useState, useEffect } from 'react'
import { ID, Query, Role, Permission } from 'appwrite'
import { Trash2 } from 'react-feather'
import client, { databases } from '../appWriteConfig'
import { COLLECTION_ID_MESSAGES, DATABASE_ID } from '../variables'
import Header from '../components/Header'
import { useAuth } from '../hooks/useAuth'

const Room = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [messageBody, setMessageBody] = useState('')

  useEffect(() => {
    getMessages()

    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      response => {
        const lastResponse = response.events[0].split('.')
        const event = lastResponse[lastResponse.length - 1]

        if (event === 'create') {
          setMessages(prev => [response.payload, ...prev])
        }
        if (event === 'delete') {
          setMessages(prev => prev.filter(message => message.$id !== response.payload.$id))
        }
      }
    )

    return () => unsubscribe()
  }, [])

  const createMessage = async e => {
    e.preventDefault()

    let payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    }

    let permissions = [Permission.write(Role.user(user.$id))]

    await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload,
      permissions
    )

    setMessageBody('')
  }

  const deleteMessage = async id => {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, id)
  }

  const getMessages = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_MESSAGES, [
        Query.orderDesc('$createdAt'),
        Query.limit(20),
      ])
      setMessages(response.documents)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('There was an error', error)
    }
  }

  return (
    <main className="container">
      <Header />
      <div className="room-container">
        <form id="message-form" onSubmit={createMessage}>
          <div>
            <textarea
              required
              maxLength="1000"
              placeholder="Say something!"
              value={messageBody}
              onChange={e => setMessageBody(e.target.value)}
            ></textarea>
          </div>
          <div className="send-btn-wrapper">
            <input className="btn btn-secondary" type="submit" value="Send" />
          </div>
        </form>
        <div>
          {messages.map(message => (
            <div key={message.$id} className="messages-wrapper">
              <div className="message-header">
                <p>
                  {message?.username ? (
                    <span>{message.username}</span>
                  ) : (
                    <span>Anonymous user</span>
                  )}
                  <small className="message-timestamp">
                    {new Date(message.$createdAt).toLocaleString()}
                  </small>
                </p>
                {message.$permissions.some(p => p.includes('delete') && p.includes(user.$id)) && (
                  <Trash2 className="delete-btn" onClick={() => deleteMessage(message.$id)} />
                )}
              </div>
              <div className="message-body">
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Room
