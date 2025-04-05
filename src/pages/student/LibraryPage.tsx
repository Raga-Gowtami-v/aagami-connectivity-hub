
import { useState, useEffect } from 'react';
import { Search, BookOpen, Video, File, ArrowRight, Clock, ChevronDown, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { searchYouTubeVideos, getPopularCourses, YouTubeVideo } from '@/lib/youtubeApi';
import { translateText, getSupportedLanguages, SupportedLanguage } from '@/lib/translationApi';
import BackButton from '@/components/shared/BackButton';

interface Textbook {
  id: string;
  title: string;
  author: string;
  subject: string;
  grade: string;
  coverImage: string;
  description: string;
  pages: number;
}

interface Document {
  id: string;
  title: string;
  type: string;
  subject: string;
  uploadedBy: string;
  uploadDate: string;
  size: string;
  downloads: number;
}

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState('textbooks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>({ code: "en", name: "English", nativeName: "English" });
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<Record<string, string>>({});

  useEffect(() => {
    document.title = 'Library - Aagami';
    
    // Load popular educational videos on initial load
    const fetchPopularVideos = async () => {
      try {
        const videos = await getPopularCourses("education");
        setYoutubeVideos(videos);
      } catch (error) {
        console.error("Error fetching popular videos:", error);
      }
    };
    
    fetchPopularVideos();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter a search term",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      if (activeTab === 'videos') {
        const videos = await searchYouTubeVideos(searchQuery);
        setYoutubeVideos(videos);
      } else {
        // For textbooks and documents, we would typically call a backend API
        // For now, we'll just show a success toast
        toast({
          title: "Search results",
          description: `Found results for "${searchQuery}"`,
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubjectFilter = (subject: string | null) => {
    setSelectedSubject(subject);
  };

  const handleGradeFilter = (grade: string | null) => {
    setSelectedGrade(grade);
  };

  const translateTextbook = async (textbookId: string, content: string) => {
    if (selectedLanguage.code === "en") {
      // Remove translation if switching back to English
      const newTranslatedContent = { ...translatedContent };
      delete newTranslatedContent[textbookId];
      setTranslatedContent(newTranslatedContent);
      return;
    }
    
    setIsTranslating(true);
    
    try {
      const translated = await translateText(content, selectedLanguage.code);
      setTranslatedContent({
        ...translatedContent,
        [textbookId]: translated
      });
      
      toast({
        title: "Translation complete",
        description: `Translated to ${selectedLanguage.name}`,
      });
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Translation failed",
        description: "Failed to translate the content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  // Sample data for textbooks
  const textbooks: Textbook[] = [
    {
      id: "tb1",
      title: "Introduction to Physics",
      author: "Dr. Rajan Mishra",
      subject: "Physics",
      grade: "10",
      coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
      description: "A comprehensive introduction to physics concepts for 10th grade students.",
      pages: 248
    },
    {
      id: "tb2",
      title: "Mathematics Fundamentals",
      author: "Prof. Anita Desai",
      subject: "Mathematics",
      grade: "9",
      coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904",
      description: "Core mathematics concepts with practice problems for 9th grade students.",
      pages: 312
    },
    {
      id: "tb3",
      title: "Biology Essentials",
      author: "Dr. Sanjay Gupta",
      subject: "Biology",
      grade: "11",
      coverImage: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe",
      description: "Comprehensive coverage of biology for 11th grade students with detailed illustrations.",
      pages: 356
    },
    {
      id: "tb4",
      title: "Chemistry Made Simple",
      author: "Dr. Priya Sharma",
      subject: "Chemistry",
      grade: "10",
      coverImage: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6",
      description: "Simplified approach to chemistry with experiments and examples.",
      pages: 284
    },
    {
      id: "tb5",
      title: "History of Modern India",
      author: "Prof. Rajiv Iyer",
      subject: "History",
      grade: "8",
      coverImage: "https://images.unsplash.com/photo-1576872381149-7847515ce5d8",
      description: "A detailed account of India's history from 1857 to independence.",
      pages: 326
    }
  ];

  // Sample data for documents
  const documents: Document[] = [
    {
      id: "doc1",
      title: "Physics Formula Sheet",
      type: "PDF",
      subject: "Physics",
      uploadedBy: "Teacher",
      uploadDate: "2023-05-15",
      size: "2.4 MB",
      downloads: 1245
    },
    {
      id: "doc2",
      title: "Mathematics Problem Set",
      type: "PDF",
      subject: "Mathematics",
      uploadedBy: "Teacher",
      uploadDate: "2023-06-22",
      size: "3.1 MB",
      downloads: 987
    },
    {
      id: "doc3",
      title: "Biology Lab Manual",
      type: "DOCX",
      subject: "Biology",
      uploadedBy: "Admin",
      uploadDate: "2023-04-10",
      size: "5.7 MB",
      downloads: 756
    },
    {
      id: "doc4",
      title: "Chemistry Periodic Table",
      type: "PDF",
      subject: "Chemistry",
      uploadedBy: "Teacher",
      uploadDate: "2023-07-05",
      size: "1.2 MB",
      downloads: 2134
    },
    {
      id: "doc5",
      title: "History Timeline Worksheet",
      type: "PDF",
      subject: "History",
      uploadedBy: "Teacher",
      uploadDate: "2023-08-18",
      size: "1.8 MB",
      downloads: 645
    }
  ];

  // Filters textbooks based on selected filters
  const filteredTextbooks = textbooks.filter(textbook => {
    const matchesSubject = !selectedSubject || textbook.subject === selectedSubject;
    const matchesGrade = !selectedGrade || textbook.grade === selectedGrade;
    const matchesSearch = !searchQuery || 
      textbook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      textbook.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      textbook.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSubject && matchesGrade && matchesSearch;
  });

  // Filters documents based on selected filters
  const filteredDocuments = documents.filter(doc => {
    const matchesSubject = !selectedSubject || doc.subject === selectedSubject;
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSubject && matchesSearch;
  });

  const subjects = ["Physics", "Mathematics", "Biology", "Chemistry", "History", "Geography", "Computer Science"];
  const grades = ["6", "7", "8", "9", "10", "11", "12"];
  const languages = getSupportedLanguages();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center">
            <BackButton to="/student-dashboard" />
            <h1 className="text-xl font-medium ml-2">Library</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search for textbooks, videos, or documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  Subject
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Subject</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSubjectFilter(null)}>
                  All Subjects
                </DropdownMenuItem>
                {subjects.map((subject) => (
                  <DropdownMenuItem key={subject} onClick={() => handleSubjectFilter(subject)}>
                    {subject}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  Grade
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Grade</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleGradeFilter(null)}>
                  All Grades
                </DropdownMenuItem>
                {grades.map((grade) => (
                  <DropdownMenuItem key={grade} onClick={() => handleGradeFilter(grade)}>
                    Grade {grade}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  {selectedLanguage.nativeName}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {languages.map((language) => (
                  <DropdownMenuItem 
                    key={language.code} 
                    onClick={() => setSelectedLanguage(language)}
                  >
                    {language.nativeName} ({language.name})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          {selectedSubject && (
            <Badge 
              variant="secondary" 
              className="flex items-center"
              onClick={() => handleSubjectFilter(null)}
            >
              Subject: {selectedSubject}
              <X className="ml-1 h-3 w-3 cursor-pointer" />
            </Badge>
          )}
          
          {selectedGrade && (
            <Badge 
              variant="secondary" 
              className="flex items-center"
              onClick={() => handleGradeFilter(null)}
            >
              Grade: {selectedGrade}
              <X className="ml-1 h-3 w-3 cursor-pointer" />
            </Badge>
          )}
          
          {selectedLanguage.code !== "en" && (
            <Badge 
              variant="secondary" 
              className="flex items-center"
            >
              Language: {selectedLanguage.name}
            </Badge>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="textbooks">
              <BookOpen className="mr-2 h-4 w-4" />
              Textbooks
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Video className="mr-2 h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="documents">
              <File className="mr-2 h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="textbooks" className="space-y-6">
            {filteredTextbooks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No textbooks found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTextbooks.map((textbook) => (
                  <Card key={textbook.id} className="overflow-hidden hover-lift">
                    <div className="aspect-[4/3] relative">
                      <img 
                        src={textbook.coverImage} 
                        alt={textbook.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge>{textbook.subject}</Badge>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="outline" className="bg-white/80">
                          Grade {textbook.grade}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{textbook.title}</CardTitle>
                      <p className="text-sm text-gray-500">{textbook.author}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        {translatedContent[textbook.id] || textbook.description}
                      </p>
                      <div className="flex items-center mt-4 text-sm text-gray-500">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{textbook.pages} pages</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => translateTextbook(textbook.id, textbook.description)}
                        disabled={isTranslating}
                      >
                        {isTranslating ? "Translating..." : (
                          translatedContent[textbook.id] ? "Show Original" : "Translate"
                        )}
                      </Button>
                      <Button>
                        Read Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="videos" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Educational Videos</h2>
              <p className="text-sm text-gray-500">Showing {youtubeVideos.length} results</p>
            </div>
            
            {youtubeVideos.length === 0 ? (
              <div className="text-center py-12">
                <Video className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No videos found</h3>
                <p className="text-gray-500">Try searching for a different topic</p>
              </div>
            ) : (
              <div className="space-y-6">
                {youtubeVideos.map((video) => (
                  <Card key={video.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-64 flex-shrink-0">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <CardHeader>
                          <CardTitle className="line-clamp-2">{video.title}</CardTitle>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">{video.channelTitle}</p>
                            <Badge variant="outline" className="ml-2">
                              <Clock className="mr-1 h-3 w-3" />
                              {video.duration}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm line-clamp-2">{video.description}</p>
                          <div className="flex items-center mt-4 text-sm text-gray-500">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            <span>{video.viewCount} views</span>
                          </div>
                        </CardContent>
                        <CardFooter className="mt-auto border-t pt-4">
                          <a 
                            href={`https://www.youtube.com/watch?v=${video.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full"
                          >
                            <Button className="w-full">
                              Watch on YouTube
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </a>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <File className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No documents found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map((document) => (
                  <Card key={document.id} className="overflow-hidden">
                    <div className="flex items-center p-4">
                      <div className="bg-primary/10 p-3 rounded-full mr-4">
                        <File className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{document.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline">{document.type}</Badge>
                          <Badge variant="outline">{document.subject}</Badge>
                          <span className="text-xs text-gray-500">{document.size}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Uploaded: {document.uploadDate}</p>
                        <p className="text-xs text-gray-500">{document.downloads} downloads</p>
                      </div>
                      <Button className="ml-4">
                        Download
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <Separator className="my-4" />
          <h2 className="text-xl font-semibold mb-4">Popular Courses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden hover-lift">
              <div className="aspect-video relative">
                <img 
                  src="https://images.unsplash.com/photo-1542831371-29b0f74f9713" 
                  alt="Web Development Course"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-medium">Web Development Bootcamp</h3>
                  <p className="text-white/80 text-sm">Complete HTML, CSS, JavaScript</p>
                </div>
              </div>
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-600">Free</span>
                  <Badge variant="outline">24 lessons</Badge>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  Start Learning
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden hover-lift">
              <div className="aspect-video relative">
                <img 
                  src="https://images.unsplash.com/photo-1580894732444-8ecded7900cd" 
                  alt="Data Science Course"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-medium">Data Science Fundamentals</h3>
                  <p className="text-white/80 text-sm">Python, Statistics, Visualization</p>
                </div>
              </div>
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-600">Free</span>
                  <Badge variant="outline">18 lessons</Badge>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  Start Learning
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden hover-lift">
              <div className="aspect-video relative">
                <img 
                  src="https://images.unsplash.com/photo-1509966756634-9c23dd6e6815" 
                  alt="Mobile App Development"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-medium">Mobile App Development</h3>
                  <p className="text-white/80 text-sm">React Native, Flutter, UI Design</p>
                </div>
              </div>
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-600">Free</span>
                  <Badge variant="outline">16 lessons</Badge>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  Start Learning
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-6 text-center">
            <Link to="/student-dashboard/learn-earn">
              <Button variant="link" className="text-primary">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LibraryPage;
