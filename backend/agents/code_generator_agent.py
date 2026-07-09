import json


def code_generator_agent(
    topic,
    language,
    call_llm
):

    prompt = f"""
You are a senior software engineer.

Task:
Generate production-quality code for:

{topic}

Programming Language:
{language}

The generated code must strictly follow the syntax and conventions of {language}.

Generate COMPLETE, CORRECT, and EXECUTABLE code.

IMPORTANT RULES

- Generate COMPLETE, COMPILABLE, and EXECUTABLE code.
- The code must compile successfully without syntax errors.
- Double-check the code before returning it.
- Fix any mistakes before producing the final answer.
- Use only official language syntax.
- Use only real standard libraries unless the user explicitly requests otherwise.
- Never invent APIs, libraries, or functions.
- Include a small usage example or main function where appropriate.
- Add concise comments only where they improve readability.
- Avoid unnecessary comments.
- Return production-quality code.
- If the topic has multiple possible implementations, choose the most modern and widely used approach.
- Follow current best practices for the selected programming language and framework.
- Prefer official libraries and recommended APIs.
- Avoid deprecated methods unless the user explicitly requests them.
- Generate realistic, production-ready code instead of simplified pseudocode.

Before returning your answer, mentally review the generated code for syntax errors and correct any mistakes.
Return ONLY valid JSON.

Return EXACTLY this format:

{{
    "code": "...",
    "explanation": "...",
    "time_complexity": "...",
    "space_complexity": "...",
    "best_practices": "...",
    "common_mistakes": "..."
}}

Do not wrap the JSON inside markdown.
Do not wrap the code inside markdown.
Do not include ```python, ```cpp, or any code fences.
Return ONLY the JSON object.
"""

    response = call_llm(
        prompt,
        json_mode=True
    )

    response = response.strip()

    try:

        data = json.loads(response)

        data["code"] = (
            data.get("code", "")
            .replace("```python", "")
            .replace("```cpp", "")
            .replace("```c++", "")
            .replace("```java", "")
            .replace("```javascript", "")
            .replace("```js", "")
            .replace("```csharp", "")
            .replace("```c#", "")
            .replace("```", "")
            .strip()
        )

        return {
            "code": data.get("code", ""),
            "explanation": data.get("explanation", ""),
            "time_complexity": data.get("time_complexity", ""),
            "space_complexity": data.get("space_complexity", ""),
            "best_practices": data.get("best_practices", ""),
            "common_mistakes": data.get("common_mistakes", "")
        }

    except Exception:

        return {
            "code": "",
            "explanation": response,
            "time_complexity": "",
            "space_complexity": "",
            "best_practices": "",
            "common_mistakes": ""
        }