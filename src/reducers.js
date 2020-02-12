export default function reducer(state = {}, action) {
    if (action.type === "RECEIVE_USERS") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes
        };
    }

    if (action.type === "ACCEPT_FRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map(user => {
                if (user.id != action.recipient_id) {
                    return user;
                } else {
                    return {
                        ...user,
                        accepted: true
                    };
                }
            })
        };
    }

    if (action.type === "UNFRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(user => {
                if (user.id != action.recipient_id) {
                    return user;
                } else {
                    return user.id !== action.recipient_id;
                }
            })
        };
    }
    if (action.type == "GET_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.msg
        };
    }
    if (action.type == "ADD_MESSAGE") {
        state = {
            ...state,
            chatMessages: [action.msg].concat(state.chatMessages)
        };
    }

    console.log("state from reducers end: ", state);

    return state;
}
