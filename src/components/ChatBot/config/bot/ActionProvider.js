class ActionProvider {
    constructor(createChatBotMessage, setStateFunc, createClientMessage) {
      this.createChatBotMessage = createChatBotMessage;
      this.setState = setStateFunc;
      this.createClientMessage = createClientMessage;
    }

    updateChatbotState(responseMessage, messageData) {
        this.setState(state => {
            if(messageData) {
                return {
                    ...state,
                    messageData,
                    messages: [...state.messages, responseMessage]
                }
            }else {
                return {
                    ...state,
                    messages: [...state.messages, responseMessage]
                }
            }
        })
    }

    handleGreet = () => {
        const message = this.createChatBotMessage("Hey, friend!")
        this.updateChatbotState(message)
    }

    catchAll = async (message) => {
        const chatbotResponse = this.createChatBotMessage("Hang on while I get your results...", {
             widget: "fetchComp"
        })
        const lowerCaseMessage = message.toLowerCase().trim()
        this.updateChatbotState(chatbotResponse, lowerCaseMessage)
    }

}
  
export default ActionProvider;