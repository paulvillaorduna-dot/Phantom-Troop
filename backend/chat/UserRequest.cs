using System;

using Phantom_Troop.backend.Deep_Infra_API;

namespace Phantom_Troop.backend.chat;

public class UserRequest
{
    private readonly DeepInfraConnect _ai;

    public UserRequest(DeepInfraConnect ai)
    {
        _ai = ai;
    }

    public async Task<string> MessageChatBot(string msg)
    {
        if (string.IsNullOrWhiteSpace(msg))
            return "Message cannot be empty.";

        return await _ai.MessageAPI(msg);
    }
}

