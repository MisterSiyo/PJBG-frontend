import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <h2>Want to create your own ?</h2>
      <button onClick={() => router.push(`/gameCreation`)}>Create your project</button>
    </>
  );
}