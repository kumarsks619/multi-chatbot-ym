import React from 'react'
import Chatbot from 'react-chatbot-kit'
import ActionProvider from './config/bot/ActionProvider'
import MessageParser from './config/bot/MessageParser'
import config from './config/bot/config'

import './ChatBot.css'


function ChatBot() {
    return (
        <div className="chatBot">
            <Chatbot
                config={config}
                actionProvider={ActionProvider}
                messageParser={MessageParser}
                headerText={"YoungMinds-Bot"}
                placeholderText={"Ask something about YoungMinds..."}
            />
        </div>
    )
}

export default ChatBot
