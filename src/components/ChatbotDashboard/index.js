import React, { useState } from 'react'

import KeywordsConsole from './KeywordsConsole'
import QueriesBoard from './QueriesBoard'
import Graph from './Graph'
import './ChatbotDashboard.css'

function ChatbotDashboard({ user }) {
    // need to pull in the current user's unique ID here and pass that to the components below

    return (
        user && (
            <div className="chatbotDashboard">
                <KeywordsConsole user={user} />
                <QueriesBoard user={user} />
                <Graph user={user} />
            </div>
        )
    )
}

export default ChatbotDashboard
