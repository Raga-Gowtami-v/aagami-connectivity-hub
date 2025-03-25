
import { useState } from "react";
import { Upload, MapPin, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { uploadFile, addDocument } from "@/lib/firestoreService";

const ReportEWastePage = () => {
  const { userData } = useAuth();
  const [images, setImages] = useState<FileList | null>(null);
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImages(e.target.files);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          
          // In a real app, we would use Google Maps Geocoding API to get the address
          setLocation("Your current location");
          
          toast({
            title: "Location retrieved",
            description: "Your current location has been detected successfully.",
          });
        },
        () => {
          toast({
            title: "Location error",
            description: "Unable to retrieve your location. Please enter it manually.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Geolocation unavailable",
        description: "Geolocation is not supported by your browser. Please enter location manually.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!images || images.length === 0) {
      toast({
        title: "No images",
        description: "Please upload at least one image of the e-waste.",
        variant: "destructive"
      });
      return;
    }

    if (!location) {
      toast({
        title: "No location",
        description: "Please enter a location or use your current location.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images to Firebase Storage
      const imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        const imageUrl = await uploadFile(images[i], "e-waste-reports");
        imageUrls.push(imageUrl);
      }

      // Save report to Firestore
      await addDocument("eWasteReports", {
        userId: userData?.uid,
        userName: userData?.displayName,
        location,
        description,
        images: imageUrls,
        coordinates: currentLocation,
        status: "pending",
      });

      toast({
        title: "Report submitted",
        description: "Your e-waste report has been submitted successfully!",
      });

      // Reset form
      setImages(null);
      setLocation("");
      setDescription("");
      setCurrentLocation(null);
      
      // Reset file input
      const fileInput = document.getElementById("e-waste-images") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Submission failed",
        description: "Failed to submit your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Report E-Waste</h1>
      <p className="text-gray-600 mb-8">
        Help us locate and recycle electronic waste in your community
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="e-waste-images" className="block text-sm font-medium text-gray-700">
                Upload Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  id="e-waste-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="e-waste-images"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-aagami-blue">
                    Click to upload images
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG, JPEG up to 10MB
                  </span>
                </label>
                {images && images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-green-600">
                      <Check className="h-4 w-4 inline mr-1" />
                      {images.length} {images.length === 1 ? "image" : "images"} selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Enter location of e-waste"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-grow"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  className="flex-shrink-0"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Current
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Describe the type and quantity of e-waste you found..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-aagami-blue hover:bg-aagami-blue/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Report...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Why Report E-Waste?</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-aagami-blue/20 text-aagami-blue mr-3">
                  1
                </span>
                <div>
                  <p className="font-medium">Environmental Impact</p>
                  <p className="text-sm text-gray-600">
                    E-waste contains hazardous materials that can contaminate soil and water if not properly disposed of.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-aagami-blue/20 text-aagami-blue mr-3">
                  2
                </span>
                <div>
                  <p className="font-medium">Resource Recovery</p>
                  <p className="text-sm text-gray-600">
                    Electronic devices contain valuable metals and components that can be recycled and reused.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-aagami-blue/20 text-aagami-blue mr-3">
                  3
                </span>
                <div>
                  <p className="font-medium">Digital Inclusion</p>
                  <p className="text-sm text-gray-600">
                    Some devices can be refurbished and donated to students who need them for education.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-aagami-blue/20 text-aagami-blue mr-3">
                  4
                </span>
                <div>
                  <p className="font-medium">Community Service</p>
                  <p className="text-sm text-gray-600">
                    You earn service credits and help clean up your community by reporting e-waste.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">What Happens Next?</h2>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-aagami-terracotta/20 text-aagami-terracotta mr-3">
                  1
                </span>
                <div>
                  <p className="font-medium">Verification</p>
                  <p className="text-sm text-gray-600">
                    Our team reviews your report to verify the type and quantity of e-waste.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-aagami-terracotta/20 text-aagami-terracotta mr-3">
                  2
                </span>
                <div>
                  <p className="font-medium">Collection Planning</p>
                  <p className="text-sm text-gray-600">
                    We coordinate with local collection partners to schedule a pickup.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-aagami-terracotta/20 text-aagami-terracotta mr-3">
                  3
                </span>
                <div>
                  <p className="font-medium">Processing</p>
                  <p className="text-sm text-gray-600">
                    The e-waste is sorted for recycling, refurbishment, or proper disposal.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-aagami-terracotta/20 text-aagami-terracotta mr-3">
                  4
                </span>
                <div>
                  <p className="font-medium">Impact Update</p>
                  <p className="text-sm text-gray-600">
                    You'll receive an update on the environmental impact of your report.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportEWastePage;
