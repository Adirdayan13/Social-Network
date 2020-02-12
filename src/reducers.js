export default function reducer(state = {}, action) {
    if (action.type === "RECEIVE_USERS") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes
        };
        console.log("state from reducer: ", state);
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
        console.log("state from accept friend reducer: ", state);
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
        console.log("action.message from reducerssss: ", action.msg);
        console.log("state from reducers: ", state);
        state = {
            ...state,
            chatMessages: [action.msg].concat(state.chatMessages)
        };
    }
    if (action.type == "MY_ID") {
        state = {
            ...state,
            my_user_id: action.my_user_id
        };
    }
    console.log("state from reducers end: ", state);

    return state;
}
