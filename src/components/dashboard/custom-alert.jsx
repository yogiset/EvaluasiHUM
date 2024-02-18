import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const CustomAlert = ({ variant, data }) => {
  return (
    <Alert variant={variant}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="mb-2">Peringatan!</AlertTitle>
      <AlertDescription>
        <ul className="list-disc">
          {data?.map((item, index) => (
            <li key={index}>{item.message}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};
