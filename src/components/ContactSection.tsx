
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    }
  });

  const navigate = useNavigate();
  const onSubmit = (data: any) => {
    const msg = data.message;
    navigate(`/chat?message=${encodeURIComponent(msg)}`);
  };

  return (
    <section id="contact" className="py-20 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gradient">
          Contact Us
        </h2>
        <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Reach out to our team for personalized travel assistance and inquiries
        </p>
        
        <div className="grid md:grid-cols-2 gap-10 mt-12">
          {/* Contact Form */}
          <div className="glass-card p-8 animate-slide-up">
            <h3 className="text-2xl font-bold mb-6 dark:text-twende-skyblue text-twende-teal">
              Send Us a Message
            </h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="What is this regarding?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How can we help you?" 
                          className="min-h-[150px] resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <button type="submit" className="btn-primary flex items-center justify-center w-full py-3">
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </button>
              </form>
            </Form>
          </div>
          
          {/* Contact Information */}
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            {/* Map Image */}
            <div className="glass-card overflow-hidden h-64 mb-8 relative">
              <img 
                src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-l+FF7F50(-1.2,5.5),pin-l+FF7F50(36.8,-1.3)/10,0,0/800x400@2x?access_token=pk.placeholder"
                alt="Office Locations" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-background/50">
                <div className="glass-card p-4">
                  <p className="font-medium text-foreground">Our offices in Ghana & Kenya</p>
                  <p className="text-sm text-muted-foreground">(Interactive map requires Mapbox token)</p>
                </div>
              </div>
            </div>
            
            {/* Contact Cards */}
            <div className="space-y-4">
              <div className="glass-card p-6 flex items-start hover-lift">
                <div className="p-3 rounded-full bg-twende-beige/20 mr-4">
                  <MapPin className="h-6 w-6 text-twende-teal dark:text-twende-skyblue" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Our Locations</h4>
                  <p className="text-muted-foreground">
                    <span className="block">25 Independence Avenue, Accra, Ghana</span>
                    <span className="block mt-1">42 Kenyatta Boulevard, Nairobi, Kenya</span>
                  </p>
                </div>
              </div>
              
              <div className="glass-card p-6 flex items-start hover-lift">
                <div className="p-3 rounded-full bg-twende-beige/20 mr-4">
                  <Mail className="h-6 w-6 text-twende-teal dark:text-twende-skyblue" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Email Us</h4>
                  <p className="text-muted-foreground">
                    <a href="mailto:info@twendetravel.com" className="block hover:text-twende-teal dark:hover:text-twende-skyblue transition-colors">info@twendetravel.com</a>
                    <a href="mailto:support@twendetravel.com" className="block mt-1 hover:text-twende-teal dark:hover:text-twende-skyblue transition-colors">support@twendetravel.com</a>
                  </p>
                </div>
              </div>
              
              <div className="glass-card p-6 flex items-start hover-lift">
                <div className="p-3 rounded-full bg-twende-beige/20 mr-4">
                  <Phone className="h-6 w-6 text-twende-teal dark:text-twende-skyblue" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Call Us</h4>
                  <p className="text-muted-foreground">
                    <a href="tel:+233540181551" className="block hover:text-twende-teal dark:hover:text-twende-skyblue transition-colors">+233 123 456 789 (Ghana)</a>
                    <a href="tel:+254123456789" className="block mt-1 hover:text-twende-teal dark:hover:text-twende-skyblue transition-colors">+254 123 456 789 (Kenya)</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
