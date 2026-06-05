type MenuItem = {
    label: string;
} & (
    | {
          link: string;
      }
    | {
          subMenuItems: MenuItem[];
      }
);
