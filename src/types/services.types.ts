export type Service = {
  id: string;
  name: string;
  description: string;
  price: string;
};

export type ServicesProps = {
  services: Service[];
};
