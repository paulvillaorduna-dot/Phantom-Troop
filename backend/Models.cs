namespace Phantom_Troop.backend;

// Body the frontend POSTs to /api/chat
public record ChatRequest(string Message);

// Body the API returns
public record ChatResponse(string Reply);
