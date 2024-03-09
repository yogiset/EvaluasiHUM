import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronsRight, Plus, Minus } from "lucide-react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { questionSchema } from "@/schema/question-schema";
import { answerSchema } from "@/schema/answer-schema";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/dashboard/form/form-input";
import { FormTextarea } from "@/components/dashboard/form/form-textarea";
import { FormSelect } from "@/components/dashboard/form/form-select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// TODO: Remove or change this later ↓↓↓
import { exampleJabatan } from "@/data/userData";

const AddQuestionPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.post("http://localhost:8082/pertanyaan/addall", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-questions"] });
      toast.success("Added successfully!");
      navigate("/dashboard/pertanyaan");
    },
    onError: () => {
      toast.error("Failed to add!");
    },
  });

  // Define a form
  const questionForm = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      koderule: "",
      kodepertanyaan: "",
    },
  });

  function onClose() {
    setOpen(false);
  }

  function addAnswer(value) {
    setAnswers([...answers, value]);
  }
  function deleteAnswer(answer) {
    const newAnswers = answers.filter((e) => e.jawaban !== answer);
    setAnswers(newAnswers);
  }

  function onSubmit(formData) {
    if (answers.length === 0) return;
    const newFormData = { ...formData, jawabanList: answers };

    mutation.mutate(newFormData);
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex items-center gap-x-2 font-medium p-2">
        <Link to={"/dashboard/pertanyaan"} className="hover:underline">
          PERTANYAAN
        </Link>
        <ChevronsRight />
        <p>TAMBAH PERTANYAAN</p>
      </div>
      <div className="w-full h-full overflow-y-auto p-2 space-y-4 pb-20">
        <Form {...questionForm}>
          <form
            onSubmit={questionForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h1 className="text-xl font-bold">Jabatan</h1>

              <FormSelect
                form={questionForm}
                id="jabatan"
                selectItems={exampleJabatan}
                placeholder="Pilih Jabatan"
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold">Rule</h1>
              <FormInput
                form={questionForm}
                label="Kode Rule"
                id="koderule"
                placeholder="Masukkan kode rule"
                type="text"
              />
              <FormTextarea
                form={questionForm}
                label="Rule"
                id="rule"
                placeholder="Masukkan rule..."
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold">Pertanyaan</h1>
              <FormInput
                form={questionForm}
                label="Kode Pertanyaan"
                id="kodepertanyaan"
                placeholder="Masukkan kode pertanyaan"
                type="text"
              />
              <FormTextarea
                form={questionForm}
                label="Pertanyaan"
                id="pertanyaan"
                placeholder="Masukkan pertanyaan..."
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold">Jawaban</h1>
              <div className="bg-neutral-100 space-y-3 p-2 rounded-md">
                <ul className="list-disc list-inside">
                  {answers.map((list, index) => (
                    <li key={index}>
                      {list.jawaban}
                      <Button
                        type="button"
                        className="h-4 bg-neutral-300 hover:bg-rose-400 text-black hover:text-white px-1 ml-2 rounded"
                        onClick={() => deleteAnswer(list.jawaban)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                    </li>
                  ))}
                </ul>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setOpen(true)}
                  className="text-neutral-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah jawaban
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex gap-x-2">
              <Button type="submit" variant="sky" disabled={mutation.isPending}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/pertanyaan")}
                disabled={mutation.isPending}
              >
                Kembali
              </Button>
            </div>
          </form>
        </Form>

        {/* Answer modal must be outside the form */}
        <AnswerModal addAnswer={addAnswer} open={open} onClose={onClose} />
      </div>
    </div>
  );
};

const AnswerModal = ({ addAnswer, open, onClose }) => {
  const answerForm = useForm({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      jawaban: "",
      bobot: 0,
    },
  });

  function submit(formData) {
    addAnswer(formData);
    answerForm.reset();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah jawaban</DialogTitle>
        </DialogHeader>
        <Form {...answerForm}>
          <form
            onSubmit={answerForm.handleSubmit(submit)}
            className="space-y-4"
          >
            <FormInput
              form={answerForm}
              label="Jawaban"
              id="jawaban"
              placeholder="Masukkan jawaban"
              type="text"
            />
            <FormInput
              form={answerForm}
              label="Bobot"
              id="bobot"
              placeholder="Masukkan bobot"
              type="number"
            />
            <div className="flex gap-x-2">
              <Button type="submit" variant="sky">
                Tambah
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestionPage;
