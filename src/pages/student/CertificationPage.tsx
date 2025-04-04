
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  GraduationCap, 
  Award, 
  CheckCircle, 
  AlertTriangle,
  ChevronRight,
  RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { generateQuestions } from '@/lib/geminiApi';
import { toast } from '@/hooks/use-toast';
import { addDocument, updateUserCoins } from '@/lib/firestoreService';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const CertificationPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState('');
  const [experience, setExperience] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    document.title = 'Get Certified - Aagami';
  }, []);

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !experience.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both topic and experience details",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Generate questions based on topic
      const generatedQuestions = await generateQuestions(topic, 'intermediate', 5);
      setQuestions(generatedQuestions);
      setAnswers(new Array(generatedQuestions.length).fill(-1));
      setStep(2);
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Error",
        description: "Failed to generate certification questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = async () => {
    // Calculate score
    let correctCount = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    
    // Save certification result to Firestore
    try {
      await addDocument('certifications', {
        userId: 'current-user-id', // In a real app, get from auth context
        topic,
        score: finalScore,
        passingScore: finalScore >= 70,
        questionsCount: questions.length,
        correctAnswers: correctCount,
        completedAt: new Date()
      });
      
      if (finalScore >= 70) {
        // Award coins for passing certification
        await updateUserCoins('current-user-id', 50);
      }
    } catch (error) {
      console.error('Error saving certification result:', error);
    }
    
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between py-4 px-6">
          <div className="flex items-center">
            <Link 
              to="/student-dashboard/learn-earn" 
              className="mr-4 p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-medium flex items-center">
              <GraduationCap className="h-6 w-6 mr-2 text-aagami-gold" />
              Become Certified
            </h1>
          </div>
        </div>
      </header>
      
      <div className="flex-1 container max-w-3xl mx-auto py-8 px-4">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-medium mb-4">Get Certified in Your Skills</h2>
              <p className="text-muted-foreground mb-6">
                Share your topic of expertise and take a short assessment to earn a certification. Once certified, you can mentor others and earn coins by sharing your knowledge.
              </p>
              
              <form onSubmit={handleTopicSubmit} className="space-y-4">
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium mb-1">
                    Certification Topic
                  </label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Mathematics, Physics, Computer Science, etc."
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium mb-1">
                    Your Experience
                  </label>
                  <Textarea
                    id="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="Briefly describe your experience with this topic..."
                    rows={4}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Test
                    </>
                  ) : (
                    <>
                      Start Certification
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </form>
            </div>
            
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-medium mb-2">Certification Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Award className="h-5 w-5 mr-2 text-aagami-gold flex-shrink-0 mt-0.5" />
                  <span>Display certification on your profile</span>
                </li>
                <li className="flex items-start">
                  <Award className="h-5 w-5 mr-2 text-aagami-gold flex-shrink-0 mt-0.5" />
                  <span>Earn coins by mentoring others in your certified skill</span>
                </li>
                <li className="flex items-start">
                  <Award className="h-5 w-5 mr-2 text-aagami-gold flex-shrink-0 mt-0.5" />
                  <span>Access to advanced learning resources in your topic</span>
                </li>
                <li className="flex items-start">
                  <Award className="h-5 w-5 mr-2 text-aagami-gold flex-shrink-0 mt-0.5" />
                  <span>Priority access to related courses and opportunities</span>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {step === 2 && questions.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-card rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">{topic} Certification</h2>
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">{questions[currentQuestionIndex].question}</h3>
                <div className="space-y-3">
                  {questions[currentQuestionIndex].options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        answers[currentQuestionIndex] === optionIndex 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestionIndex, optionIndex)}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          answers[currentQuestionIndex] === optionIndex 
                            ? 'border-primary bg-primary text-white' 
                            : 'border-gray-400'
                        }`}>
                          {answers[currentQuestionIndex] === optionIndex && (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button 
                    onClick={handleNext}
                    disabled={answers[currentQuestionIndex] === -1}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmitTest}
                    disabled={answers.includes(-1)}
                  >
                    Submit Test
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex justify-between bg-muted/40 rounded-lg p-4 text-sm">
              <div>
                <span className="font-medium">Topics:</span> {topic}
              </div>
              <div>
                <span className="font-medium">Questions:</span> {questions.length}
              </div>
              <div>
                <span className="font-medium">Passing Score:</span> 70%
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="glass-card rounded-xl p-6 animate-fade-in">
            <div className="text-center mb-6">
              {score >= 70 ? (
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-10 w-10 text-amber-500" />
                </div>
              )}
              
              <h2 className="text-2xl font-bold mb-2">
                {score >= 70 ? "Congratulations!" : "Not Certified Yet"}
              </h2>
              
              <p className="text-muted-foreground">
                {score >= 70 
                  ? "You've successfully earned your certification." 
                  : "Don't worry, you can try again after reviewing the material."}
              </p>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-medium">Your Score:</span>
                <span className={`font-bold ${score >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
                  {score}%
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${score >= 70 ? 'bg-green-500' : 'bg-amber-500'}`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
            
            {score >= 70 ? (
              <div className="space-y-4">
                <p>You've earned:</p>
                <Card className="bg-aagami-gold/10 border-aagami-gold">
                  <CardContent className="p-4 flex items-center">
                    <Award className="h-8 w-8 text-aagami-gold mr-3" />
                    <div>
                      <p className="font-bold">{topic} Certification Badge</p>
                      <p className="text-sm">Added to your profile</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/10 border-primary">
                  <CardContent className="p-4 flex items-center">
                    <Award className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <p className="font-bold">+50 Coins</p>
                      <p className="text-sm">Added to your wallet</p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex space-x-3 mt-6">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate('/student-dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => navigate('/student-dashboard/learn-earn')}
                  >
                    View Certifications
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p>Here are some resources to help you prepare:</p>
                <div className="space-y-2">
                  <Card>
                    <CardContent className="p-3 flex justify-between items-center">
                      <span>Review Materials for {topic}</span>
                      <Button variant="link" size="sm" asChild>
                        <Link to="/student-dashboard/library">View</Link>
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 flex justify-between items-center">
                      <span>Practice Questions</span>
                      <Button variant="link" size="sm" asChild>
                        <Link to="/student-dashboard/practice">View</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate('/student-dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationPage;
