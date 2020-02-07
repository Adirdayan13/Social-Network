export default function reducer(state = {}, action) {
    if (action.type === "RECEIVE_USERS") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes
        };
        console.log("state from reducer: ", state);
        // immutably - array
        // map - good for changing item(s) in an array
        // concat - combine two or more arays into one array
        // filter - remove an item(s) from an array
        // ... - clone array or objects
        // Object.assign - make copy of objects
    }

    if (action.type === "ALL_CAPS_WITH_UNDERSCORE") {
        //do something
    }

    if (action.type === "ALL_CAPS_WITH_UNDERSCORE") {
        //do something
    }

    return state;
}
