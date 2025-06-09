
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { serviceRequestService } from "@/services/service-requests";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  destination: z.string().min(2, "Destination must be at least 2 characters"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  budget: z.string().min(1, "Budget is required"),
  service_type: z.string().min(1, "Service type is required"),
  accommodation_preference: z.string().optional(),
  transportation_preference: z.string().optional(),
  special_requirements: z.string().optional(),
});

export function ServiceRequestForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      start_date: "",
      end_date: "",
      budget: "",
      service_type: "",
      accommodation_preference: "",
      transportation_preference: "",
      special_requirements: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await serviceRequestService.createServiceRequest({
        destination: values.destination,
        start_date: values.start_date,
        end_date: values.end_date,
        budget: parseFloat(values.budget),
        service_type: values.service_type,
        accommodation_preference: values.accommodation_preference || undefined,
        transportation_preference: values.transportation_preference || undefined,
        special_requirements: values.special_requirements || undefined,
      });
      
      toast({
        title: "Service request submitted",
        description: "We'll review your request and get back to you soon.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting service request:", error);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <FormControl>
                  <Input placeholder="Where do you want to go?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (USD)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter your budget" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="service_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full_package">Full Travel Package</SelectItem>
                    <SelectItem value="accommodation">Accommodation Only</SelectItem>
                    <SelectItem value="transportation">Transportation Only</SelectItem>
                    <SelectItem value="activities">Activities & Tours</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accommodation_preference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accommodation Preference</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select accommodation preference" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="mid_range">Mid Range</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="apartment">Apartment/Villa</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="transportation_preference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transportation Preference</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transportation preference" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="private_car">Private Car</SelectItem>
                    <SelectItem value="public_transport">Public Transport</SelectItem>
                    <SelectItem value="rental">Car Rental</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="special_requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requirements</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any special requirements or preferences?"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Submit Request</Button>
        </form>
      </Form>
    </Card>
  );
}
