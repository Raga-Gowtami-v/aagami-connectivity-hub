
import { useState, useEffect } from "react";
import { 
  Search, 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  Bookmark, 
  Filter, 
  Languages, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { translateText } from "@/lib/googleApis";
import { recommendLearningPath } from "@/lib/geminiApi";
import { queryCollection } from "@/lib/firestoreService";

// Sample data - in a real app this would come from Firestore
const RESOURCES = [
  {
    id: "1",
    title: "Introduction to Algebra",
    type: "document",
    subject: "Mathematics",
    level: "Beginner",
    format: "PDF",
    description: "A comprehensive introduction to algebra concepts with practice problems.",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1635372722656-389f87a941db?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["algebra", "mathematics", "beginner"]
  },
  {
    id: "2",
    title: "Cell Biology Explained",
    type: "video",
    subject: "Biology",
    level: "Intermediate",
    format: "MP4",
    description: "Video explaining cell structure, function and division processes.",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["biology", "cells", "science"]
  },
  {
    id: "3",
    title: "Newton's Laws of Motion",
    type: "document",
    subject: "Physics",
    level: "Intermediate",
    format: "PDF",
    description: "Detailed explanation of Newton's three laws of motion with examples.",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["physics", "mechanics", "newton"]
  },
  {
    id: "4",
    title: "Chemical Bonding Tutorial",
    type: "video",
    subject: "Chemistry",
    level: "Advanced",
    format: "MP4",
    description: "Comprehensive tutorial on different types of chemical bonds.",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["chemistry", "bonding", "tutorial"]
  },
  {
    id: "5",
    title: "World History: Ancient Civilizations",
    type: "document",
    subject: "History",
    level: "Beginner",
    format: "PDF",
    description: "Overview of major ancient civilizations and their contributions.",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["history", "ancient", "civilizations"]
  },
  {
    id: "6",
    title: "Python Programming Basics",
    type: "interactive",
    subject: "Computer Science",
    level: "Beginner",
    format: "HTML",
    description: "Interactive tutorial on Python programming fundamentals.",
    url: "#",
    thumbnail: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["programming", "python", "computer science"]
  }
];

const LibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [resources, setResources] = useState(RESOURCES);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [translatedContent, setTranslatedContent] = useState<{[key: string]: string}>({});
  const [selectedLanguage, setSelectedLanguage] = useState("original");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [personalizedPath, setPersonalizedPath] = useState<any>(null);

  useEffect(() => {
    // In a real app, we would fetch resources from Firestore
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        // This would be replaced with actual Firestore query
        // const data = await queryCollection("learningResources");
        // setResources(data);
        
        // Also fetch user's bookmarks
        // const bookmarkData = await queryCollection("bookmarks", [{ field: "userId", operator: "==", value: userId }]);
        // setBookmarkedIds(bookmarkData.map(item => item.resourceId));
        
        // Using sample data for demo
        setResources(RESOURCES);
        setBookmarkedIds(["1", "4"]); // Sample bookmarked items
      } catch (error) {
        console.error("Error fetching resources:", error);
        toast({
          title: "Error loading resources",
          description: "Failed to load resources. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    // Generate AI personalized learning path - in a real app this would use Gemini API
    const generatePersonalizedPath = async () => {
      try {
        const path = await recommendLearningPath(
          "Student", 
          ["mathematics", "science"], 
          ["basic algebra", "physics fundamentals"], 
          ["improve academic performance", "prepare for exams"]
        );
        setPersonalizedPath(path);
      } catch (error) {
        console.error("Error generating learning path:", error);
      }
    };

    generatePersonalizedPath();
  }, []);

  const handleTranslate = async (id: string, content: string) => {
    if (selectedLanguage === "original") {
      setTranslatedContent({});
      return;
    }
    
    if (translatedContent[id]) return;
    
    setIsTranslating(true);
    try {
      const translated = await translateText(content, selectedLanguage);
      setTranslatedContent(prev => ({
        ...prev,
        [id]: translated
      }));
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Translation failed",
        description: "Failed to translate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleBookmark = (id: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(bookmarkId => bookmarkId !== id));
      toast({
        title: "Bookmark removed",
        description: "Resource removed from your bookmarks",
      });
      // In a real app: remove from Firestore
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      toast({
        title: "Bookmark added",
        description: "Resource added to your bookmarks",
      });
      // In a real app: add to Firestore
    }
  };

  const handleDownload = (resource: any) => {
    toast({
      title: "Download started",
      description: `Downloading ${resource.title}...`,
    });
    // In a real app, this would actually download the file
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
                         
    const matchesSubject = selectedSubject === "all" || resource.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesLevel = selectedLevel === "all" || resource.level.toLowerCase() === selectedLevel.toLowerCase();
    const matchesType = selectedType === "all" || resource.type.toLowerCase() === selectedType.toLowerCase();
    
    return matchesSearch && matchesSubject && matchesLevel && matchesType;
  });

  const bookmarkedResources = resources.filter(resource => bookmarkedIds.includes(resource.id));

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Learning Library</h1>
      <p className="text-gray-600 mb-8">
        Explore our collection of educational resources to enhance your learning journey
      </p>

      {/* Search and Filters */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="computer science">Computer Science</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Resource Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="interactive">Interactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Personalized Learning Path Card */}
      {personalizedPath && (
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-aagami-blue/20 to-aagami-sage/20 border-none">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Your Personalized Learning Path
              </CardTitle>
              <CardDescription>
                AI-generated learning path based on your interests and goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">{personalizedPath.description}</p>
              <div className="space-y-4">
                {personalizedPath.steps.map((step: any, index: number) => (
                  <div key={index} className="bg-white rounded-md p-3 shadow-sm">
                    <h4 className="font-medium text-aagami-blue mb-2">{index + 1}. {step.title}</h4>
                    <div className="space-y-2">
                      {step.resources.map((resource: any, resIndex: number) => (
                        <div key={resIndex} className="flex justify-between items-center text-sm">
                          <span>{resource.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {resource.type} • {resource.duration || `${resource.pages} pages`}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-aagami-blue hover:bg-aagami-blue/90">
                Start Learning Path
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Library Content */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            All Resources
          </TabsTrigger>
          <TabsTrigger value="bookmarked" className="flex items-center">
            <Bookmark className="mr-2 h-4 w-4" />
            Bookmarked
          </TabsTrigger>
        </TabsList>
        
        {/* Language Selector */}
        <div className="flex justify-end mb-4 mt-4">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="original">Original</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <TabsContent value="all">
          {isLoading ? (
            <div className="text-center py-12">
              <p>Loading resources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No resources found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard 
                  key={resource.id}
                  resource={resource}
                  isBookmarked={bookmarkedIds.includes(resource.id)}
                  toggleBookmark={toggleBookmark}
                  handleDownload={handleDownload}
                  translatedContent={translatedContent[resource.id]}
                  handleTranslate={handleTranslate}
                  isTranslating={isTranslating}
                  selectedLanguage={selectedLanguage}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bookmarked">
          {bookmarkedResources.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No bookmarks yet</h3>
              <p className="text-gray-500">Bookmark resources to access them quickly later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedResources.map((resource) => (
                <ResourceCard 
                  key={resource.id}
                  resource={resource}
                  isBookmarked={true}
                  toggleBookmark={toggleBookmark}
                  handleDownload={handleDownload}
                  translatedContent={translatedContent[resource.id]}
                  handleTranslate={handleTranslate}
                  isTranslating={isTranslating}
                  selectedLanguage={selectedLanguage}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ResourceCardProps {
  resource: any;
  isBookmarked: boolean;
  toggleBookmark: (id: string) => void;
  handleDownload: (resource: any) => void;
  translatedContent?: string;
  handleTranslate: (id: string, content: string) => void;
  isTranslating: boolean;
  selectedLanguage: string;
}

const ResourceCard = ({ 
  resource, 
  isBookmarked, 
  toggleBookmark, 
  handleDownload,
  translatedContent,
  handleTranslate,
  isTranslating,
  selectedLanguage
}: ResourceCardProps) => {
  const { id, title, type, subject, level, description, thumbnail } = resource;
  
  const getTypeIcon = () => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  useEffect(() => {
    if (selectedLanguage !== "original" && !translatedContent) {
      handleTranslate(id, description);
    }
  }, [selectedLanguage, id, description, translatedContent]);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
            onClick={() => toggleBookmark(id)}
          >
            <Bookmark 
              className={`h-4 w-4 ${isBookmarked ? "fill-aagami-gold text-aagami-gold" : "text-gray-600"}`} 
            />
          </Button>
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge className={`
            ${type === 'document' ? 'bg-aagami-blue/80' : 
             type === 'video' ? 'bg-aagami-terracotta/80' : 
             'bg-aagami-sage/80'} 
            text-white
          `}>
            <span className="flex items-center">
              {getTypeIcon()}
              <span className="ml-1 capitalize">{type}</span>
            </span>
          </Badge>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
        <CardDescription className="flex flex-wrap gap-2">
          <Badge variant="outline">{subject}</Badge>
          <Badge variant="outline">{level}</Badge>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3">
          {selectedLanguage !== "original" && translatedContent ? 
            translatedContent : 
            description
          }
          {selectedLanguage !== "original" && !translatedContent && isTranslating && (
            <span className="italic text-gray-400"> (Translating...)</span>
          )}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleDownload(resource)}
          className="flex items-center"
        >
          <Download className="mr-1 h-4 w-4" />
          Download
        </Button>
        
        {selectedLanguage !== "original" && !translatedContent && !isTranslating && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleTranslate(id, description)}
            className="flex items-center"
          >
            <Languages className="mr-1 h-4 w-4" />
            Translate
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LibraryPage;
