import { createChatBotMessage } from "react-chatbot-kit"
import FetchComp from '../../FetchComp'


const botName = "YoMo"

const config = {
    botName: botName,
    initialMessages: [
        createChatBotMessage(`Hi, myself ${botName}.`)
    ],
    state: {
        messageData: ""
    },
    customStyles: {
        botMessageBox: {
            backgroundColor: "#376B7E"
        },
        chatButton: {
            backgroundColor: "#376B7E"
        }
    },
    widgets: [
        {
            widgetName: "fetchComp",
            widgetFunc: (props) => <FetchComp {...props} />,
            mapStateToProps: [
                "messageData",
            ]
        }
    ]
}

export default config