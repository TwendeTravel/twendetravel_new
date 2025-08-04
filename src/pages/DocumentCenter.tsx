import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Filter,
  Eye,
  Trash2,
  Share2,
  Plus,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Folder,
  File,
  Image,
  FileType,
  Paperclip
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';

interface Document {
  id: string;
  name: string;
  type: 'passport' | 'visa' | 'flight' | 'hotel' | 'insurance' | 'vaccination' | 'other';
  category: 'travel-documents' | 'reservations' | 'insurance' | 'medical' | 'personal';
  fileType: 'pdf' | 'image' | 'document';
  size: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'valid' | 'expiring-soon' | 'expired' | 'pending';
  tripId?: string;
  tripName?: string;
  tags: string[];
  description?: string;
  url: string;
  isShared: boolean;
}

const documentTypes = [
  { value: 'passport', label: 'Passport', icon: FileText },
  { value: 'visa', label: 'Visa', icon: FileText },
  { value: 'flight', label: 'Flight Ticket', icon: FileText },
  { value: 'hotel', label: 'Hotel Reservation', icon: FileText },
  { value: 'insurance', label: 'Travel Insurance', icon: FileText },
  { value: 'vaccination', label: 'Vaccination Card', icon: FileText },
  { value: 'other', label: 'Other', icon: File }
];

const documentCategories = [
  { value: 'travel-documents', label: 'Travel Documents' },
  { value: 'reservations', label: 'Reservations' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'medical', label: 'Medical' },
  { value: 'personal', label: 'Personal' }
];

export default function DocumentCenter() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // Mock document data
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'US Passport - John Smith',
      type: 'passport',
      category: 'travel-documents',
      fileType: 'pdf',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      expiryDate: '2030-08-15',
      status: 'valid',
      tags: ['passport', 'official'],
      description: 'Primary travel document',
      url: '#',
      isShared: false
    },
    {
      id: '2',
      name: 'Schengen Visa',
      type: 'visa',
      category: 'travel-documents',
      fileType: 'pdf',
      size: '1.8 MB',
      uploadDate: '2024-03-20',
      expiryDate: '2024-12-20',
      status: 'expiring-soon',
      tags: ['visa', 'europe'],
      description: 'Multiple entry visa for Europe',
      url: '#',
      isShared: false
    },
    {
      id: '3',
      name: 'Flight Ticket - JFK to ATH',
      type: 'flight',
      category: 'reservations',
      fileType: 'pdf',
      size: '856 KB',
      uploadDate: '2024-06-01',
      tripId: '1',
      tripName: 'Mediterranean Adventure',
      status: 'valid',
      tags: ['flight', 'delta'],
      description: 'Outbound flight ticket',
      url: '#',
      isShared: true
    },
    {
      id: '4',
      name: 'Canaves Oia Suites Booking',
      type: 'hotel',
      category: 'reservations',
      fileType: 'pdf',
      size: '1.2 MB',
      uploadDate: '2024-06-01',
      tripId: '1',
      tripName: 'Mediterranean Adventure',
      status: 'valid',
      tags: ['hotel', 'santorini'],
      description: 'Hotel reservation confirmation',
      url: '#',
      isShared: true
    },
    {
      id: '5',
      name: 'Travel Insurance Policy',
      type: 'insurance',
      category: 'insurance',
      fileType: 'pdf',
      size: '3.1 MB',
      uploadDate: '2024-01-10',
      expiryDate: '2025-01-10',
      status: 'valid',
      tags: ['insurance', 'comprehensive'],
      description: 'Annual travel insurance coverage',
      url: '#',
      isShared: false
    },
    {
      id: '6',
      name: 'COVID-19 Vaccination Record',
      type: 'vaccination',
      category: 'medical',
      fileType: 'image',
      size: '2.8 MB',
      uploadDate: '2023-12-15',
      status: 'valid',
      tags: ['vaccination', 'covid'],
      description: 'Digital vaccination certificate',
      url: '#',
      isShared: false
    }
  ]);

  const [newDocument, setNewDocument] = useState({
    name: '',
    type: 'other' as Document['type'],
    category: 'personal' as Document['category'],
    description: '',
    expiryDate: '',
    tags: [] as string[],
    tripId: ''
  });

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      case 'oldest':
        return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      case 'expiry':
        if (!a.expiryDate && !b.expiryDate) return 0;
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'expiring-soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4" />;
      case 'expiring-soon':
        return <AlertTriangle className="w-4 h-4" />;
      case 'expired':
        return <AlertTriangle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'image':
        return <Image className="w-8 h-8 text-blue-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const handleDownload = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    toast({
      title: 'Downloading Document',
      description: `${doc?.name} is being prepared for download.`
    });
  };

  const handleView = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    toast({
      title: 'Opening Document',
      description: `${doc?.name} will open in a new window.`
    });
  };

  const handleShare = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    setDocuments(docs => 
      docs.map(d => d.id === docId ? { ...d, isShared: !d.isShared } : d)
    );
    
    toast({
      title: doc?.isShared ? 'Document Unshared' : 'Document Shared',
      description: doc?.isShared 
        ? 'Document is no longer shared with your concierge.'
        : 'Document is now shared with your concierge.'
    });
  };

  const handleDelete = (docId: string) => {
    setDocuments(docs => docs.filter(d => d.id !== docId));
    toast({
      title: 'Document Deleted',
      description: 'The document has been permanently removed.'
    });
  };

  const handleUpload = () => {
    // Simulate file upload
    const newDoc: Document = {
      id: Date.now().toString(),
      name: newDocument.name,
      type: newDocument.type,
      category: newDocument.category,
      fileType: 'pdf',
      size: '1.5 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: newDocument.expiryDate || undefined,
      status: 'valid',
      tags: newDocument.tags,
      description: newDocument.description,
      url: '#',
      isShared: false
    };

    setDocuments(docs => [newDoc, ...docs]);
    setIsUploadDialogOpen(false);
    setNewDocument({
      name: '',
      type: 'other',
      category: 'personal',
      description: '',
      expiryDate: '',
      tags: [],
      tripId: ''
    });

    toast({
      title: 'Document Uploaded',
      description: 'Your document has been successfully uploaded and processed.'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getExpiryWarning = (expiryDate?: string) => {
    if (!expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays < 30) return `Expires in ${diffDays} days`;
    return null;
  };

  const documentStats = {
    total: documents.length,
    valid: documents.filter(d => d.status === 'valid').length,
    expiring: documents.filter(d => d.status === 'expiring-soon').length,
    expired: documents.filter(d => d.status === 'expired').length,
    shared: documents.filter(d => d.isShared).length
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Document Center</h1>
                <p className="text-gray-600">Manage your travel documents securely</p>
              </div>

              <div className="flex items-center gap-2">
                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload New Document</DialogTitle>
                      <DialogDescription>
                        Add a new document to your secure document center
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="documentName">Document Name</Label>
                        <Input
                          id="documentName"
                          value={newDocument.name}
                          onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter document name"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="documentType">Document Type</Label>
                          <Select 
                            value={newDocument.type} 
                            onValueChange={(value: Document['type']) => 
                              setNewDocument(prev => ({ ...prev, type: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {documentTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="documentCategory">Category</Label>
                          <Select 
                            value={newDocument.category} 
                            onValueChange={(value: Document['category']) => 
                              setNewDocument(prev => ({ ...prev, category: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {documentCategories.map(category => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          value={newDocument.expiryDate}
                          onChange={(e) => setNewDocument(prev => ({ ...prev, expiryDate: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newDocument.description}
                          onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of the document"
                          rows={3}
                        />
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">
                          Drag and drop your file here, or click to browse
                        </p>
                        <p className="text-xs text-gray-500">
                          Supports PDF, JPG, PNG up to 10MB
                        </p>
                        <Button variant="outline" className="mt-4">
                          Choose File
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsUploadDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleUpload} disabled={!newDocument.name}>
                        Upload Document
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{documentStats.total}</div>
                  <div className="text-sm text-gray-600">Total Documents</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{documentStats.valid}</div>
                  <div className="text-sm text-gray-600">Valid</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{documentStats.expiring}</div>
                  <div className="text-sm text-gray-600">Expiring Soon</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{documentStats.expired}</div>
                  <div className="text-sm text-gray-600">Expired</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{documentStats.shared}</div>
                  <div className="text-sm text-gray-600">Shared</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {documentCategories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="valid">Valid</SelectItem>
                    <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="expiry">Expiry Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDocuments.map((document) => (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getFileTypeIcon(document.fileType)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                            {document.name}
                          </h3>
                          <p className="text-xs text-gray-500">{document.size}</p>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Paperclip className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleView(document.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(document.id)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(document.id)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            {document.isShared ? 'Unshare' : 'Share'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(document.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(document.status)} variant="secondary">
                          {getStatusIcon(document.status)}
                          <span className="ml-1">{document.status.replace('-', ' ')}</span>
                        </Badge>
                        {document.isShared && (
                          <Badge variant="outline" className="text-blue-600">
                            <Share2 className="w-3 h-3 mr-1" />
                            Shared
                          </Badge>
                        )}
                      </div>

                      {document.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {document.description}
                        </p>
                      )}

                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Uploaded: {formatDate(document.uploadDate)}
                        </div>
                        
                        {document.expiryDate && (
                          <div className="flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Expires: {formatDate(document.expiryDate)}
                            {getExpiryWarning(document.expiryDate) && (
                              <span className="ml-2 text-red-600 font-medium">
                                ({getExpiryWarning(document.expiryDate)})
                              </span>
                            )}
                          </div>
                        )}

                        {document.tripName && (
                          <div className="flex items-center">
                            <Folder className="w-3 h-3 mr-1" />
                            Trip: {document.tripName}
                          </div>
                        )}
                      </div>

                      {document.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {document.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {document.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{document.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button 
                          onClick={() => handleView(document.id)}
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          onClick={() => handleDownload(document.id)}
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {sortedDocuments.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'Upload your first document to get started.'}
                </p>
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
