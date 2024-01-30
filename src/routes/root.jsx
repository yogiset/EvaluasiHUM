import { useState } from "react";
import { Button } from "@/components/ui/button";

function Root() {
  const [count, setCount] = useState(0);
  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-y-4">
        <h1 className="font-semibold text-3xl">Hello world</h1>
        <Button onClick={() => setCount(count + 1)}>Count is {count}</Button>
      </div>
    </>
  );
}

export default Root;
