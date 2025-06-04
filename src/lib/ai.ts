
type PromptType = {
  systemPrompt: string,
  userPrompt: string
}
export const ai = async ({systemPrompt, userPrompt}: PromptType) => {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.AI_KEY} `,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "deepseek/deepseek-chat:free",
     messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ]
  })
});
  const data = await response.json();
  return {
    result: data.choices[0].message.content,
    insights: data.usage
  }
}

