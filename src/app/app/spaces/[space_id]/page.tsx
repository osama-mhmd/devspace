import permissionLayer from "./permission-layer";
import Survey from "./survey";

const Space = async ({ params }: { params: Promise<{ space_id: string }> }) => {
  const space_id = (await params).space_id;

  return permissionLayer(space_id, async () => {
    return (
      <>
        Space
        <Survey />
      </>
    );
  });
};

export default Space;
