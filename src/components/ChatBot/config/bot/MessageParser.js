class MessageParser {
    constructor(actionProvider, state) {
      this.actionProvider = actionProvider;
      this.state = state;
    }
  
    parse(message) {
        const lowerCaseMessage = message.toLowerCase()

        if(lowerCaseMessage.includes("hello") || lowerCaseMessage === "hi" || lowerCaseMessage.includes("hey")) {
          return this.actionProvider.handleGreet()
        }

        return this.actionProvider.catchAll(lowerCaseMessage)
    }
}
  
export default MessageParser;