let pubNub;
let channelName;
let UID;
let user;

function initPubNub(pubKey, subKey, uid, channel, username) {
    console.log(pubKey, subKey)
    pubNub = new PubNub({
        publishKey : pubKey,
        subscribeKey : subKey,
        uuid: uid,
        logVerbosity: true,
        ssl: true
    });

    pubNub.addListener({
        status: function(statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                console.log('join success with UID: ' + UID);
            }
        },
        message: function(msg) {
            console.log(msg);
            if (msg.message.uuid != UID) {
                addRemoteMsg(msg.message.uuid, msg.message.description, msg.message.title)
            } else {
                console.log('message sent successfully to channel');
            }
        },
        presence: function(presenceEvent) {
            // handle presence events
            console.log('presence event: ' + JSON.stringify(presenceEvent));
        }
    })      
    console.log("Subscribing..");

    // subscribe a pubNub Channel using the same name as our video chat
    pubNub.subscribe({
        channels: [channel] 
    });

    channelName = channel;
    UID = uid;
    user=username;
}

function publishMessage(message, callback) {
    var msgConfig = {
        channel : channelName,
        sendByPost: true,
        message: { 
            uuid: UID,
            title: user,
            description: message
        }
    }
    pubNub.publish(msgConfig, function(status, response) {
        console.log(status, response);
        if (callback != undefined && callback instanceof Function) {
            callback();
        }
    })
}