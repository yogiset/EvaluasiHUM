import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronsRight, Plus, Minus, Info } from "lucide-react";
import axios from "axios";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { editQuestionSchema } from "@/schema/edit-question-schema";
import { answerSchema } from "@/schema/answer-schema";
import { toast } from "sonner";
import { Loading } from "@/components/dashboard/loading";
import { FormInput } from "@/components/dashboard/form/form-input";
import { FormTextarea } from "@/components/dashboard/form/form-textarea";
import { FormSelect } from "@/components/dashboard/form/form-select";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// TODO: Remove or change this later ↓↓↓
import { exampleJabatan } from "@/data/userData";

const DetailQuestionPage = () => {
  const { questionId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Define a form
  const editQuestionForm = useForm({
    resolver: zodResolver(editQuestionSchema),
    defaultValues: {
      rule: "",
      pertanyaan: "",
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-question", questionId],
    queryFn: fetchQuestion,
  });

  async function fetchQuestion() {
    const response = await axios.get(
      `http://localhost:8082/pertanyaan/findbyidperjaw/${questionId}`
    );

    if (response.status === 200) {
      editQuestionForm.setValue("rule", response.data.rule);
      editQuestionForm.setValue("pertanyaan", response.data.pertanyaan);
      editQuestionForm.setValue("jabatan", response.data.jabatan);
      setAnswers(response.data.jawabanList);
      return response.data;
    }
  }

  const mutation = useMutation({
    mutationFn: ({ formData, id }) => {
      return axios.put(
        `http://localhost:8082/pertanyaan/editall/${id}`,
        formData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-questions"] });
      toast.success("Edited successfully!");
      navigate("/dashboard/pertanyaan");
    },
    onError: () => {
      toast.error("Failed to edit!");
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
    if (answers.length === 0 || !isEdit) return;
    const newFormData = { ...formData, jawabanList: answers };
    mutation.mutate({ formData: newFormData, id: data.idper });
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center flex-col text-center">
        <Info />
        <h1 className="text-xl font-semibold">Error!</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex items-center gap-x-2 font-medium p-2">
        <Link to={"/dashboard/pertanyaan"} className="hover:underline">
          PERTANYAAN
        </Link>
        <ChevronsRight />
        <p>{questionId}</p>
      </div>
      <div className="w-full h-full overflow-y-auto p-2 space-y-4 pb-20">
        {isLoading ? (
          <Loading />
        ) : (
          <Form {...editQuestionForm}>
            <form
              onSubmit={editQuestionForm.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h1 className="text-xl font-bold">Rule</h1>
                {isEdit ? (
                  <FormTextarea
                    form={editQuestionForm}
                    label="Rule"
                    id="rule"
                    placeholder="Masukkan rule..."
                  />
                ) : (
                  <p>{data.rule}</p>
                )}
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-bold">Pertanyaan</h1>
                {isEdit ? (
                  <FormTextarea
                    form={editQuestionForm}
                    label="Pertanyaan"
                    id="pertanyaan"
                    placeholder="Masukkan pertanyaan..."
                  />
                ) : (
                  <p>{data.pertanyaan}</p>
                )}
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-bold">Jabatan</h1>
                {isEdit ? (
                  <FormSelect
                    form={editQuestionForm}
                    id="jabatan"
                    selectItems={exampleJabatan}
                    placeholder="Pilih Jabatan"
                  />
                ) : (
                  <p>{data.jabatan}</p>
                )}
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
                          className={cn(
                            "h-4 bg-neutral-300 hover:bg-rose-400 text-black hover:text-white px-1 ml-2 rounded",
                            !isEdit && "hidden"
                          )}
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
                    className={cn("text-neutral-600", !isEdit && "hidden")}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah jawaban
                  </Button>
                </div>
              </div>

              <Separator />

              {isEdit ? (
                <div className="flex gap-x-2">
                  <Button
                    type="submit"
                    variant="sky"
                    disabled={mutation.isPending}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEdit(false)}
                    disabled={mutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex gap-x-2">
                  {/* TODO: Improve this later ↓↓↓ */}
                  <Button type="submit" className="hidden"></Button>

                  <Button
                    type="button"
                    variant="sky"
                    onClick={() => setIsEdit(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard/pertanyaan")}
                  >
                    Kembali
                  </Button>
                </div>
              )}
            </form>
          </Form>
        )}
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

export default DetailQuestionPage;
