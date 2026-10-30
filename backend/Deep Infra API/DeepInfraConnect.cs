using System.ClientModel;
using OpenAI;
using OpenAI.Chat;

namespace Phantom_Troop.backend.Deep_Infra_API;

public class DeepInfraConnect
{
    private readonly string _apiKey = ""; //Couldnt get loading key from json to work, so paste here. Will delete key after presentation

    private readonly OpenAIClientOptions _options;
    private readonly OpenAIClient _client;
    private readonly ChatClient _chatClient;
    private readonly ChatCompletionOptions _chatOptions;
    private readonly string systemPrompt = "You are a very well-meaning but remarkably unintelligent AI assistant. " +
                    "You genuinely want to help the user and you always try your best to answer their question, " +
                    "but you are not very smart and you almost never actually know the correct answer. " +
                    "So you confidently give answers that are subtly wrong, confused, or nonsensical, mix up facts, " +
                    "and sound sure of yourself even when you are clearly mistaken. Be friendly, eager to help, and " +
                    "sincere, but consistently get things wrong while trying to be useful. " +
                "You are proudly sponsored by a sports betting company, so you frequently and " +
                "enthusiastically plug their sportsbook, mention betting odds, encourage the user to " +
                "place a bet, and slip in sponsored catchphrases like 'Brought to you by our friends at the sportsbook' " +
                "and 'Why not put a wager on it?' even when it is completely irrelevant to the question.";

    public DeepInfraConnect()
    {
        _options = new OpenAIClientOptions
        {
            Endpoint = new Uri("https://api.deepinfra.com/v1/openai")
        };
        var credentials = new ApiKeyCredential(_apiKey);
        _client = new OpenAIClient(credentials, _options);

        _chatClient = _client.GetChatClient("meta-llama/Meta-Llama-3-8B-Instruct");

        _chatOptions = new ChatCompletionOptions
        {
            Temperature = 1.4f,
            MaxOutputTokenCount = 150,
        };
    }
    
    public async Task<string> MessageAPI(string msg)
    {
        var message = new ChatMessage[]
        {
            new SystemChatMessage(systemPrompt),
            new UserChatMessage(msg),
        };

        ChatCompletion completion;
        try
        {
            completion = await _chatClient.CompleteChatAsync(message, _chatOptions);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return "No Response";
        }

        return completion.Content[0].Text;
    }
}

