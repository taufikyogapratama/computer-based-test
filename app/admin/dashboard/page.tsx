import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <>
      <h1>
        Ini tampilan dashboard, yang hanya bisa dilihat admin atau guru, guru
        bisa memenejemen ujian disini
      </h1>
      <Button className="rounded-md">Click me</Button>
    </>
  );
};

export default Dashboard;
