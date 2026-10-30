using Phantom_Troop.backend;
using Phantom_Troop.backend.chat;
using Phantom_Troop.backend.Deep_Infra_API;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    ContentRootPath = AppContext.BaseDirectory
});

// Load appsettings (copied next to the exe) + env var overrides
builder.Configuration
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
    .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: false)
    .AddEnvironmentVariables();

// CORS: allow the frontend to call us from browsers
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

// Register services in DI
builder.Services.AddSingleton<DeepInfraConnect>();
builder.Services.AddSingleton<UserRequest>();

var app = builder.Build();

app.UseCors();

app.MapPost("/api/chat", async (ChatRequest req, UserRequest chat) =>
{
    if (string.IsNullOrWhiteSpace(req.Message))
        return Results.BadRequest(new ChatResponse("Message cannot be empty."));

    var reply = await chat.MessageChatBot(req.Message);
    return Results.Ok(new ChatResponse(reply));
});

app.Run();

