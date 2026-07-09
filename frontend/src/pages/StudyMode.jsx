import { useState, useEffect } from "react";
import StudyHeader from "../components/study/StudyHeader";
import TopicInput from "../components/study/TopicInput";
import AgentCards from "../components/study/AgentCards";
import LoadingScreen from "../components/study/LoadingScreen";
import SourcesCard from "../components/study/SourcesCard";
import ResultViewer from "../components/study/ResultViewer";
import QuizSection from "../components/study/QuizSection";
import TutorChat from "../components/study/TutorChat";
import InterviewChat from "../components/study/InterviewChat";
import ResultActions from "../components/study/ResultActions";

function StudyMode() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [tutorAnswer, setTutorAnswer] = useState("");
  const [currentAgent, setCurrentAgent] = useState("");
  const [loading, setLoading] = useState(false);
  const [citations, setCitations] = useState([]);
  const [dots, setDots] = useState("");
  const [questions, setQuestions] = useState([]);
  const [writtenQuestions, setWrittenQuestions] = useState([]);
  const [writtenAnswers, setWrittenAnswers] = useState({});
  const [writtenFeedback, setWrittenFeedback] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [explanations, setExplanations] = useState({});
  const [loadingExplanation, setLoadingExplanation] = useState({});
  const [tutorConversation, setTutorConversation] = useState([]);
  const [sendingTutor, setSendingTutor] = useState(false);
  const [interviewConversation, setInterviewConversation] = useState([]);
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [sendingInterview, setSendingInterview] = useState(false);

  useEffect(() => {
    if (!loading) {
      setDots("");
      return;
    }
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

  const callAgent = async (agentType) => {
    if (!topic.trim()) {
      alert("Please enter a topic.");
      return;
    }
    setLoading(true);
    setResult("");
    setCitations([]);
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setScore(0);

    setWrittenQuestions([]);
    setWrittenAnswers({});
    setWrittenFeedback({});

    setExplanations({});
    setLoadingExplanation({});
    setCurrentAgent(agentType);

    const token = localStorage.getItem("token");
    await fetch("http://127.0.0.1:8000/study-mode", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      const response = await fetch(`http://127.0.0.1:8000/${agentType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      if (agentType === "quiz") {
        setQuestions(data.questions || []);
        setWrittenQuestions(data.written_questions || []);
        setResult("");
      } else if (agentType === "tutor") {
        setTutorConversation([]);
        setResult(data.answer || "");
      } else if (agentType === "interview") {
        setInterviewConversation([
          {
            interviewer: data.answer,
          },
        ]);

        setResult("");
      } else {
        setResult(data.answer || "");
      }

      setCitations(data.citations || []);
    } catch (error) {
      console.error(error);
      alert("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const sendTutorMessage = async () => {
    if (!tutorAnswer.trim()) return;

    setSendingTutor(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/tutor-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic,
          message: tutorAnswer,
          history: [
            ...tutorConversation,
            {
              student: tutorAnswer,
            },
          ],
        }),
      });
      const data = await response.json();
      setTutorConversation((prev) => [
        ...prev,
        {
          student: tutorAnswer,
          tutor: data.answer,
        },
      ]);
      setTutorAnswer("");
    } catch (error) {
      console.error(error);
      alert("Failed to contact tutor.");
    } finally {
      setSendingTutor(false);
    }
  };

  const sendInterviewMessage = async () => {
    if (!interviewAnswer.trim()) return;

    setSendingInterview(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/interview-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic,
          message: interviewAnswer,
          history: [
            ...interviewConversation,
            {
              student: interviewAnswer,
            },
          ],
        }),
      });
      const data = await response.json();
      setInterviewConversation((prev) => [
        ...prev,
        {
          student: interviewAnswer,
          interviewer: data.answer,
        },
      ]);
      setInterviewAnswer("");
    } catch (error) {
      console.error(error);
      alert("Failed to contact tutor.");
    } finally {
      setSendingInterview(false);
    }
  };

  const selectAnswer = (questionIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleWrittenAnswer = (index, value) => {
    setWrittenAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const submitQuiz = async () => {
    let correct = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        correct++;
      }
    });

    setScore(correct);
    setSubmitted(true);

    // الإضافة الثانية: إرسال نتيجة الاختبار (quiz-result)
    const token = localStorage.getItem("token");
    await fetch("http://127.0.0.1:8000/quiz-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        topic,
        score: correct,
        total: questions.length,
      }),
    });

    const feedback = {};

    for (let i = 0; i < writtenQuestions.length; i++) {
      const currentToken = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/evaluate-written", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          question: writtenQuestions[i],
          answer: writtenAnswers[i] || "",
        }),
      });

      const data = await response.json();

      feedback[i] = data.feedback;
    }

    setWrittenFeedback(feedback);
  };

  const explainQuestion = async (question, index) => {
    if (explanations[index]) return;

    setLoadingExplanation((prev) => ({
      ...prev,
      [index]: true,
    }));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/explanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: question.question,
          student_answer: answers[index] || "No Answer",
          correct_answer: question.answer,
        }),
      });

      const data = await response.json();

      setExplanations((prev) => ({
        ...prev,
        [index]: data.answer,
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to generate explanation.");
    }

    setLoadingExplanation((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  return (
    <div className="p-10">
      <StudyHeader />

      <TopicInput
        topic={topic}
        setTopic={setTopic}
        onEnter={() => callAgent("summary")}
      />

      <AgentCards loading={loading} callAgent={callAgent} />

      {questions.length === 0 && (
        <>
          <ResultActions
            result={result}
            onRegenerate={() => callAgent(currentAgent)}
            onClear={() => {
              setResult("");
              setCitations([]);
            }}
          />
          <ResultViewer loading={loading} result={result} currentAgent={currentAgent}>
            <LoadingScreen dots={dots} />
          </ResultViewer>
        </>
      )}

      {questions.length > 0 && (
        <QuizSection
          questions={questions}
          answers={answers}
          submitted={submitted}
          score={score}
          selectAnswer={selectAnswer}
          submitQuiz={submitQuiz}
          explainQuestion={explainQuestion}
          explanations={explanations}
          loadingExplanation={loadingExplanation}
        />
      )}

      <TutorChat
        currentAgent={currentAgent}
        tutorConversation={tutorConversation}
        tutorAnswer={tutorAnswer}
        setTutorAnswer={setTutorAnswer}
        sendTutorMessage={sendTutorMessage}
        sendingTutor={sendingTutor}
      />

      <InterviewChat
        currentAgent={currentAgent}
        interviewConversation={interviewConversation}
        interviewAnswer={interviewAnswer}
        setInterviewAnswer={setInterviewAnswer}
        sendInterviewMessage={sendInterviewMessage}
        sendingInterview={sendingInterview}
      />

      <SourcesCard citations={citations} />
    </div>
  );
}

export default StudyMode;