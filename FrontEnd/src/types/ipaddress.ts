// sample IP address object
//   {
//     "id": "string",
//     "name": "string",
//     "type": "string",
//     "status": "Active",
//     "location": "string",
//     "assignedTo": "string",
//     "createdAt": "2025-12-21T16:03:30.003Z",
//     "updatedAt": "2025-12-21T16:03:30.003Z",
//     "ipAddress": "string",
//     "subnet": "string",
//     "gateway": "string",
//     "dns": "string",
//     "vlan": "string"
//   }

export type IPAddressType = {
  id: string;
  name: string;
    type: string;
    status: string;
    location: string;
    assignedTo?: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress: string;
    subnet: string;
    gateway?: string;
    dns?: string;
    vlan?: string;
};