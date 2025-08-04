import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  Download, 
  Plus,
  Eye,
  Trash2,
  Edit3,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Receipt,
  Clock,
  Shield,
  Star,
  MoreVertical,
  Filter,
  Search,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'paypal' | 'bank';
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  holderName: string;
  isDefault: boolean;
  isExpired: boolean;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  description: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  method: {
    type: string;
    last4: string;
  };
  tripId?: string;
  tripName?: string;
  receiptUrl: string;
  category: 'flight' | 'hotel' | 'insurance' | 'concierge' | 'other';
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  tripId: string;
  tripName: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  pdfUrl: string;
}

export default function PaymentBilling() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('methods');
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'credit',
      brand: 'Visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2026,
      holderName: 'John Smith',
      isDefault: true,
      isExpired: false,
      billingAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      }
    },
    {
      id: '2',
      type: 'credit',
      brand: 'Mastercard',
      last4: '5555',
      expiryMonth: 8,
      expiryYear: 2025,
      holderName: 'John Smith',
      isDefault: false,
      isExpired: false,
      billingAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      }
    },
    {
      id: '3',
      type: 'credit',
      brand: 'American Express',
      last4: '1005',
      expiryMonth: 3,
      expiryYear: 2024,
      holderName: 'John Smith',
      isDefault: false,
      isExpired: true,
      billingAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      }
    }
  ]);

  // Mock transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      amount: 3200,
      currency: 'USD',
      description: 'Mediterranean Adventure - Full Package',
      status: 'completed',
      date: '2024-06-15',
      method: { type: 'Visa', last4: '4242' },
      tripId: '1',
      tripName: 'Mediterranean Adventure',
      receiptUrl: '#',
      category: 'concierge'
    },
    {
      id: '2',
      amount: 1200,
      currency: 'USD',
      description: 'Flight Tickets - JFK to ATH',
      status: 'completed',
      date: '2024-06-01',
      method: { type: 'Visa', last4: '4242' },
      tripId: '1',
      tripName: 'Mediterranean Adventure',
      receiptUrl: '#',
      category: 'flight'
    },
    {
      id: '3',
      amount: 850,
      currency: 'USD',
      description: 'Canaves Oia Suites - 7 nights',
      status: 'completed',
      date: '2024-06-01',
      method: { type: 'Mastercard', last4: '5555' },
      tripId: '1',
      tripName: 'Mediterranean Adventure',
      receiptUrl: '#',
      category: 'hotel'
    },
    {
      id: '4',
      amount: 250,
      currency: 'USD',
      description: 'Travel Insurance - Annual Coverage',
      status: 'completed',
      date: '2024-01-15',
      method: { type: 'Visa', last4: '4242' },
      receiptUrl: '#',
      category: 'insurance'
    },
    {
      id: '5',
      amount: 3800,
      currency: 'USD',
      description: 'Alpine Ski Retreat - Deposit',
      status: 'pending',
      date: '2024-11-20',
      method: { type: 'Visa', last4: '4242' },
      tripId: '2',
      tripName: 'Alpine Ski Retreat',
      receiptUrl: '#',
      category: 'concierge'
    }
  ]);

  // Mock invoices
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      amount: 3200,
      currency: 'USD',
      issueDate: '2024-06-01',
      dueDate: '2024-06-15',
      status: 'paid',
      tripId: '1',
      tripName: 'Mediterranean Adventure',
      items: [
        { description: 'Concierge Service Fee', quantity: 1, unitPrice: 500, total: 500 },
        { description: 'Flight Booking Fee', quantity: 1, unitPrice: 50, total: 50 },
        { description: 'Hotel Booking Fee', quantity: 7, unitPrice: 25, total: 175 },
        { description: 'Trip Planning & Coordination', quantity: 1, unitPrice: 300, total: 300 }
      ],
      pdfUrl: '#'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      amount: 1900,
      currency: 'USD',
      issueDate: '2024-11-15',
      dueDate: '2024-12-01',
      status: 'pending',
      tripId: '2',
      tripName: 'Alpine Ski Retreat',
      items: [
        { description: 'Concierge Service Fee', quantity: 1, unitPrice: 600, total: 600 },
        { description: 'Ski Equipment Rental', quantity: 7, unitPrice: 75, total: 525 },
        { description: 'Private Ski Lessons', quantity: 3, unitPrice: 150, total: 450 }
      ],
      pdfUrl: '#'
    }
  ]);

  const [newCard, setNewCard] = useState({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    holderName: '',
    isDefault: false
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.tripName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'week':
          matchesDate = transactionDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          matchesDate = transactionDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          matchesDate = transactionDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'refunded':
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Receipt className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'flight':
        return '✈️';
      case 'hotel':
        return '🏨';
      case 'insurance':
        return '🛡️';
      case 'concierge':
        return '🎯';
      default:
        return '📋';
    }
  };

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'american express':
        return '💳';
      default:
        return '💳';
    }
  };

  const handleSetDefault = (cardId: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === cardId
      }))
    );
    
    toast({
      title: 'Default Card Updated',
      description: 'Your default payment method has been updated.'
    });
  };

  const handleDeleteCard = (cardId: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== cardId));
    toast({
      title: 'Card Removed',
      description: 'The payment method has been removed from your account.'
    });
  };

  const handleAddCard = () => {
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: 'credit',
      brand: 'Visa', // This would be detected from the card number
      last4: newCard.number.slice(-4),
      expiryMonth: parseInt(newCard.expiryMonth),
      expiryYear: parseInt(newCard.expiryYear),
      holderName: newCard.holderName,
      isDefault: newCard.isDefault,
      isExpired: false,
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    };

    if (newCard.isDefault) {
      setPaymentMethods(methods => 
        methods.map(method => ({ ...method, isDefault: false }))
      );
    }

    setPaymentMethods(methods => [newMethod, ...methods]);
    setIsAddCardDialogOpen(false);
    setNewCard({
      number: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
      holderName: '',
      isDefault: false
    });

    toast({
      title: 'Card Added',
      description: 'Your new payment method has been added successfully.'
    });
  };

  const handleDownloadReceipt = (transactionId: string) => {
    toast({
      title: 'Downloading Receipt',
      description: 'Your receipt is being prepared for download.'
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: 'Downloading Invoice',
      description: 'Your invoice is being prepared for download.'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const paymentStats = {
    totalSpent: transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    pendingPayments: transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
    thisMonth: transactions.filter(t => {
      const date = new Date(t.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).reduce((sum, t) => sum + t.amount, 0),
    savedCards: paymentMethods.filter(m => !m.isExpired).length
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
                <h1 className="text-3xl font-bold text-gray-900">Payment & Billing</h1>
                <p className="text-gray-600">Manage your payment methods and view billing history</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Payment Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatAmount(paymentStats.totalSpent)}
                  </div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {formatAmount(paymentStats.pendingPayments)}
                  </div>
                  <div className="text-sm text-gray-600">Pending Payments</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatAmount(paymentStats.thisMonth)}
                  </div>
                  <div className="text-sm text-gray-600">This Month</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{paymentStats.savedCards}</div>
                  <div className="text-sm text-gray-600">Saved Cards</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="methods">Payment Methods</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Payment Methods Tab */}
            <TabsContent value="methods" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Payment Methods</h2>
                <Dialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Card
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Payment Method</DialogTitle>
                      <DialogDescription>
                        Add a new credit or debit card to your account
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={newCard.number}
                          onChange={(e) => setNewCard(prev => ({ ...prev, number: e.target.value }))}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="expiryMonth">Month</Label>
                          <Select 
                            value={newCard.expiryMonth} 
                            onValueChange={(value) => setNewCard(prev => ({ ...prev, expiryMonth: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                  {(i + 1).toString().padStart(2, '0')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="expiryYear">Year</Label>
                          <Select 
                            value={newCard.expiryYear} 
                            onValueChange={(value) => setNewCard(prev => ({ ...prev, expiryYear: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => (
                                <SelectItem key={i} value={(new Date().getFullYear() + i).toString()}>
                                  {new Date().getFullYear() + i}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            value={newCard.cvc}
                            onChange={(e) => setNewCard(prev => ({ ...prev, cvc: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="holderName">Cardholder Name</Label>
                        <Input
                          id="holderName"
                          placeholder="John Smith"
                          value={newCard.holderName}
                          onChange={(e) => setNewCard(prev => ({ ...prev, holderName: e.target.value }))}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="setDefault"
                          checked={newCard.isDefault}
                          onCheckedChange={(checked) => setNewCard(prev => ({ ...prev, isDefault: checked }))}
                        />
                        <Label htmlFor="setDefault">Set as default payment method</Label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddCardDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddCard} 
                        disabled={!newCard.number || !newCard.holderName}
                      >
                        Add Card
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className={`${method.isDefault ? 'ring-2 ring-blue-500' : ''} ${method.isExpired ? 'opacity-60' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getCardIcon(method.brand)}</div>
                          <div>
                            <div className="font-semibold">
                              {method.brand} •••• {method.last4}
                            </div>
                            <div className="text-sm text-gray-500">
                              {method.holderName}
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {!method.isDefault && (
                              <DropdownMenuItem onClick={() => handleSetDefault(method.id)}>
                                <Star className="w-4 h-4 mr-2" />
                                Set as Default
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCard(method.id)}
                              className="text-red-600"
                              disabled={method.isDefault}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Expires</span>
                          <span className={method.isExpired ? 'text-red-600' : ''}>
                            {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                          </span>
                        </div>

                        {method.isExpired && (
                          <Badge variant="destructive" className="w-full justify-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Expired
                          </Badge>
                        )}

                        {method.isDefault && !method.isExpired && (
                          <Badge variant="secondary" className="w-full justify-center">
                            <Star className="w-3 h-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add Card Placeholder */}
                <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                  <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsAddCardDialogOpen(true)}
                      className="h-auto flex-col gap-2"
                    >
                      <Plus className="w-8 h-8 text-gray-400" />
                      <span className="text-gray-600">Add New Card</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search transactions..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="week">Last Week</SelectItem>
                        <SelectItem value="month">Last Month</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions List */}
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                            {getCategoryIcon(transaction.category)}
                          </div>
                          
                          <div>
                            <h3 className="font-semibold">{transaction.description}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{formatDate(transaction.date)}</span>
                              <span>•</span>
                              <span>{transaction.method.type} •••• {transaction.method.last4}</span>
                              {transaction.tripName && (
                                <>
                                  <span>•</span>
                                  <span>{transaction.tripName}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              {formatAmount(transaction.amount, transaction.currency)}
                            </div>
                            <Badge className={getStatusColor(transaction.status)} variant="secondary">
                              {getStatusIcon(transaction.status)}
                              <span className="ml-1">{transaction.status}</span>
                            </Badge>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleDownloadReceipt(transaction.id)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download Receipt
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTransactions.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
                    <p className="text-gray-600">
                      {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                        ? 'Try adjusting your filters to see more results.'
                        : 'Your transactions will appear here.'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Invoices Tab */}
            <TabsContent value="invoices" className="space-y-6">
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                          <p className="text-gray-600">{invoice.tripName}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>Issued: {formatDate(invoice.issueDate)}</span>
                            <span>•</span>
                            <span>Due: {formatDate(invoice.dueDate)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-semibold text-xl">
                              {formatAmount(invoice.amount, invoice.currency)}
                            </div>
                            <Badge className={getStatusColor(invoice.status)} variant="secondary">
                              {getStatusIcon(invoice.status)}
                              <span className="ml-1">{invoice.status}</span>
                            </Badge>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleDownloadInvoice(invoice.id)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="space-y-2">
                          {invoice.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.description} {item.quantity > 1 && `(${item.quantity}x)`}</span>
                              <span>{formatAmount(item.total)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Preferences</CardTitle>
                  <CardDescription>Manage your billing and payment preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoCharge">Automatic Charging</Label>
                      <p className="text-sm text-gray-500">
                        Automatically charge your default payment method for bookings
                      </p>
                    </div>
                    <Switch id="autoCharge" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailReceipts">Email Receipts</Label>
                      <p className="text-sm text-gray-500">
                        Send receipts and invoices to your email
                      </p>
                    </div>
                    <Switch id="emailReceipts" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="saveCards">Save Payment Methods</Label>
                      <p className="text-sm text-gray-500">
                        Securely save cards for future bookings
                      </p>
                    </div>
                    <Switch id="saveCards" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="billingAlerts">Billing Alerts</Label>
                      <p className="text-sm text-gray-500">
                        Get notified about payment due dates and receipts
                      </p>
                    </div>
                    <Switch id="billingAlerts" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Your payment information is secured with industry-standard encryption</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div className="text-sm">
                      <div className="font-medium text-green-900">Your payments are secure</div>
                      <div className="text-green-700">
                        We use 256-bit SSL encryption and are PCI DSS compliant
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}
