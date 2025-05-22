import { Fragment } from "react";
import permissionLayer from "./permission-layer";
import Survey from "./survey";
import Projects from "./projects";

const Space = async ({ params }: { params: Promise<{ space_id: string }> }) => {
  const space_id = (await params).space_id;

  return permissionLayer(space_id, async () => {
    return (
      <Fragment>
        <section className="mt-20">
          <div className="container">
            {/* Projects area */}
            <Projects spaceId={space_id} />
          </div>
        </section>
        <Survey />
      </Fragment>
    );
  });
};

export default Space;
