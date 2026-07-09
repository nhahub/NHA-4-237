import json


def project_builder_agent(
    topic,
    call_llm
):

    prompt = f"""
You are a senior software architect.

Project Topic:

{topic}

Design a complete, realistic, production-quality software project.

IMPORTANT RULES

- Build a practical project.
- Follow modern software engineering practices.
- Choose appropriate technologies.
- Provide realistic architecture.
- Organize the project clearly.
- Return ONLY valid JSON.

Return EXACTLY this format:

{{
    "title":"",
    "objective":"",
    "technologies":"",
    "architecture":"",
    "file_structure":"",
    "algorithms":"",
    "testing":"",
    "future_improvements":""
}}

Do not wrap the JSON inside markdown.

Do not return ```json.

Return ONLY the JSON object.
"""

    response = call_llm(
        prompt,
        json_mode=True
    )

    response = response.strip()

    try:

        data = json.loads(response)

        return {
            "title": data.get("title", ""),
            "objective": data.get("objective", ""),
            "technologies": data.get("technologies", ""),
            "architecture": data.get("architecture", ""),
            "file_structure": data.get("file_structure", ""),
            "algorithms": data.get("algorithms", ""),
            "testing": data.get("testing", ""),
            "future_improvements": data.get("future_improvements", "")
        }

    except Exception:

        return {
            "title": "",
            "objective": response,
            "technologies": "",
            "architecture": "",
            "file_structure": "",
            "algorithms": "",
            "testing": "",
            "future_improvements": ""
        }