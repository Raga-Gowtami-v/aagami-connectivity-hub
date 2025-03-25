
import { useState } from "react";
import { Scan, Upload, Smartphone, Camera, Laptop, Monitor, Tablet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { uploadFile, addDocument } from "@/lib/firestoreService";
import { assessDeviceCondition } from "@/lib/visionApi";

const DEVICE_TYPES = [
  { icon: Smartphone, label: "Smartphone" },
  { icon: Laptop, label: "Laptop" },
  { icon: Tablet, label: "Tablet" },
  { icon: Monitor, label: "Monitor/Display" },
  { icon: Camera, label: "Camera" },
];

const ScanDonatePage = () => {
  const [deviceType, setDeviceType] = useState<string>("");
  const [deviceModel, setDeviceModel] = useState<string>("");
  const [deviceCondition, setDeviceCondition] = useState<string>("");
  const [images, setImages] = useState<FileList | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorContact, setDonorContact] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [scanResults, setScanResults] = useState<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImages(e.target.files);
    }
  };

  const handleScanDevice = async () => {
    if (!images || images.length === 0) {
      toast({
        title: "No images",
        description: "Please upload at least one image of the device to scan.",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setScanResults(null);

    try {
      // In a real app, upload the image first to get a URL
      const imageUrl = await uploadFile(images[0], "device-scans");
      
      // Then use Cloud Vision API to analyze the device
      const results = await assessDeviceCondition(imageUrl);
      
      setScanResults(results);
      
      // Auto-fill form fields based on scan results
      setDeviceType(results.deviceType.toLowerCase());
      setDeviceCondition(results.condition.toLowerCase());
      setAdditionalInfo(`Device type: ${results.deviceType}\nBrand: ${results.brand}\nEstimated age: ${results.estimatedAge}\nIssues: ${results.issues.join(', ')}\n\n${additionalInfo}`);
      
      toast({
        title: "Scan complete",
        description: `Device scanned successfully: ${results.deviceType} in ${results.condition} condition.`,
      });
    } catch (error) {
      console.error("Error scanning device:", error);
      toast({
        title: "Scan failed",
        description: "Failed to scan device. Please try again or enter details manually.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deviceType || !deviceCondition || !images || images.length === 0) {
      toast({
        title: "Incomplete information",
        description: "Please fill in all required fields and upload at least one image.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload all images
      const imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        const imageUrl = await uploadFile(images[i], "donated-devices");
        imageUrls.push(imageUrl);
      }

      // Save donation to Firestore
      await addDocument("deviceDonations", {
        deviceType,
        deviceModel,
        deviceCondition,
        images: imageUrls,
        additionalInfo,
        donorName,
        donorContact,
        scanResults,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Donation submitted",
        description: "Your device donation has been submitted successfully!",
      });

      // Reset form
      setDeviceType("");
      setDeviceModel("");
      setDeviceCondition("");
      setImages(null);
      setAdditionalInfo("");
      setDonorName("");
      setDonorContact("");
      setScanResults(null);
      
      // Reset file input
      const fileInput = document.getElementById("device-images") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error submitting donation:", error);
      toast({
        title: "Submission failed",
        description: "Failed to submit your donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Scan & Donate Device</h1>
      <p className="text-gray-600 mb-8">
        Donate your old electronic devices to help students in need
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="device-images" className="block text-sm font-medium text-gray-700">
                Upload Device Images *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  id="device-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="device-images"
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
                  <div className="mt-4 flex flex-col items-center">
                    <p className="text-sm text-green-600 mb-2">
                      {images.length} {images.length === 1 ? "image" : "images"} selected
                    </p>
                    <Button
                      type="button"
                      onClick={handleScanDevice}
                      className="bg-aagami-sage hover:bg-aagami-sage/90"
                      disabled={isScanning}
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Scan className="mr-2 h-4 w-4" />
                          Scan Device
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="device-type">Device Type *</Label>
                <Select value={deviceType} onValueChange={setDeviceType}>
                  <SelectTrigger id="device-type">
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smartphone">Smartphone</SelectItem>
                    <SelectItem value="laptop">Laptop</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="monitor">Monitor/Display</SelectItem>
                    <SelectItem value="camera">Camera</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="device-model">Model/Brand</Label>
                <Input
                  id="device-model"
                  placeholder="e.g., Samsung Galaxy S10"
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="device-condition">Device Condition *</Label>
              <Select value={deviceCondition} onValueChange={setDeviceCondition}>
                <SelectTrigger id="device-condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent - Like new</SelectItem>
                  <SelectItem value="good">Good - Minor wear</SelectItem>
                  <SelectItem value="fair">Fair - Working with some issues</SelectItem>
                  <SelectItem value="poor">Poor - Major issues but functional</SelectItem>
                  <SelectItem value="non-functional">Non-functional - For parts only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional-info">Additional Information</Label>
              <Textarea
                id="additional-info"
                placeholder="Any additional details about the device, accessories included, known issues, etc."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="donor-name">Your Name</Label>
                <Input
                  id="donor-name"
                  placeholder="Full name"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="donor-contact">Contact Number</Label>
                <Input
                  id="donor-contact"
                  placeholder="Phone number"
                  value={donorContact}
                  onChange={(e) => setDonorContact(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-aagami-blue hover:bg-aagami-blue/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Donation...
                </>
              ) : (
                "Submit Donation"
              )}
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          {scanResults ? (
            <Card className="bg-gradient-to-br from-aagami-sage/20 to-aagami-blue/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scan className="mr-2 h-5 w-5" />
                  Scan Results
                </CardTitle>
                <CardDescription>
                  AI assessment of your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Device Type:</span>
                  <span>{scanResults.deviceType}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Brand:</span>
                  <span>{scanResults.brand}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Estimated Age:</span>
                  <span>{scanResults.estimatedAge}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Condition:</span>
                  <span className={`
                    ${scanResults.condition === "Excellent" ? "text-green-600" : 
                      scanResults.condition === "Good" ? "text-blue-600" : 
                      scanResults.condition === "Fair" ? "text-yellow-600" : 
                      "text-red-600"}
                    font-medium
                  `}>
                    {scanResults.condition}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Recycle Value:</span>
                  <span>₹{scanResults.recycleValue}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Donation Suitability:</span>
                  <span className={`
                    ${scanResults.donationSuitability === "High" ? "text-green-600" : 
                      scanResults.donationSuitability === "Medium" ? "text-yellow-600" : 
                      "text-red-600"}
                    font-medium
                  `}>
                    {scanResults.donationSuitability}
                  </span>
                </div>
                
                <div className="pt-2">
                  <h4 className="font-medium mb-2">Issues Detected:</h4>
                  <ul className="text-sm space-y-1">
                    {scanResults.issues.map((issue: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <h4 className="font-medium mb-1">Recommendation:</h4>
                  <p className="text-sm">{scanResults.recommendation}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DEVICE_TYPES.map((device, index) => {
                const DeviceIcon = device.icon;
                return (
                  <Card 
                    key={index} 
                    className={`cursor-pointer hover:border-aagami-blue transition-all ${
                      deviceType === device.label.toLowerCase() ? 'border-aagami-blue bg-aagami-blue/5' : ''
                    }`}
                    onClick={() => setDeviceType(device.label.toLowerCase())}
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <DeviceIcon className="h-12 w-12 text-gray-600 mb-3" />
                      <h3 className="font-medium">{device.label}</h3>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>
                Our AI-powered device assessment process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-aagami-blue/20 text-aagami-blue mr-3">
                  1
                </div>
                <div>
                  <p className="font-medium">Upload Photos</p>
                  <p className="text-sm text-gray-600">
                    Take clear photos of your device from multiple angles showing its condition.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-aagami-blue/20 text-aagami-blue mr-3">
                  2
                </div>
                <div>
                  <p className="font-medium">AI Analysis</p>
                  <p className="text-sm text-gray-600">
                    Our Cloud Vision AI analyzes the photos to assess device type, condition, and value.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-aagami-blue/20 text-aagami-blue mr-3">
                  3
                </div>
                <div>
                  <p className="font-medium">Recommendation</p>
                  <p className="text-sm text-gray-600">
                    We determine if the device is best suited for donation, recycling, or parts recovery.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-aagami-blue/20 text-aagami-blue mr-3">
                  4
                </div>
                <div>
                  <p className="font-medium">Pickup or Drop-off</p>
                  <p className="text-sm text-gray-600">
                    Arrange for device pickup or drop-off at a designated collection point.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-aagami-terracotta/20 to-aagami-sage/10">
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">
                By donating your old device, you're helping bridge the digital divide and providing educational opportunities for underprivileged students.
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white/50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-aagami-terracotta">1,250+</p>
                  <p className="text-xs">Devices Donated</p>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-aagami-sage">3,800+</p>
                  <p className="text-xs">Students Helped</p>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-aagami-blue">15+</p>
                  <p className="text-xs">Tons E-Waste Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScanDonatePage;
