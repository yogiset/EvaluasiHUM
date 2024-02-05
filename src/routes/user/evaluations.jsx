import HomeLayout from "@/layouts/home-layout";
import { useState } from "react";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { questions } from "@/data/questions"; // TODO: Dummy data, remove this later

const Header = () => {
  return (
    <div className="w-full h-[300px] bg-waves bg-cover bg-center flex flex-col items-center text-center pt-24">
      <h1 className="text-4xl font-semibold">Evaluasi HUM</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque,
        expedita.
      </p>
    </div>
  );
};

const Card = ({ data }) => {
  const [radioValue, setRadioValue] = useState();
  return (
    <div className="w-full bg-white shadow-md border p-2 rounded-md mb-4 md:mb-6">
      <h1 className="text-xl sm:text-2xl lg:text-3xl mb-4">{data.q}</h1>

      <Separator />

      <Accordion type="single" collapsible>
        <AccordionItem
          value="item-1"
          className={cn(
            "bg-white border-none outline-none p-2 rounded",
            radioValue && "bg-green-100"
          )}
        >
          <AccordionTrigger>
            <h1 className="flex">
              {radioValue && <Check className="mr-2" />} Your answer here!
            </h1>
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              onValueChange={(value) => setRadioValue(value)}
              className="space-y-3"
              value={radioValue}
            >
              {data.answ.map((e) => (
                <div key={e.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={e} id={`option-one${e.id}`} />
                  <Label htmlFor={`option-one${e.id}`}>{e.p}</Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

// main element
const EvaluationPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  function goPrev() {
    if (page === 1) return navigate("/evaluasi/user-form");

    // save the current page to url params
    setSearchParams({ page: page - 1 });

    setPage(page - 1);
  }

  function goNext() {
    // save the current page to url params
    setSearchParams({ page: page + 1 });

    setPage(page + 1);
  }

  function onSubmit(e) {
    e.preventDefault();

    // TODO: Submit the data to the API
    navigate("/results");
  }

  // TODO: fetch the API when the page is first render and the page was changed

  return (
    <HomeLayout>
      <div className="w-full min-h-screen flex flex-col items-center mb-20">
        <Header />
        <div className="w-full max-w-4xl px-2">
          {/* TODO: Delete this slice method bellow when integrated to the API */}
          {questions.slice(page * 5 - 5, page * 5).map((data) => (
            <Card key={data.id} data={data} />
          ))}
          <div className="w-full flex justify-between items-center">
            <Button variant="sky" onClick={goPrev}>
              <ChevronLeft /> Prev
            </Button>

            {/* Just testing ↓↓↓ */}
            <p className="text-xl font-medium">
              {"<<"} {page} {">>"}
            </p>

            {page !== questions.length / 5 ? (
              <Button variant="sky" onClick={goNext}>
                Next <ChevronRight />
              </Button>
            ) : (
              <Button type="submit" onClick={(e) => onSubmit(e)}>
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default EvaluationPage;
