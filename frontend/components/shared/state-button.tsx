import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";


interface StateButton {
  isLoading: boolean;
}

export function StateButton({ isLoading }: StateButton) {
  return (
    <Button size={"lg"} className="w-full">
      {isLoading ? (
        <>
          <Spinner /> Entrando
        </>
      ) : (
        <>Entrar</>
      )}
    </Button>
  );
}