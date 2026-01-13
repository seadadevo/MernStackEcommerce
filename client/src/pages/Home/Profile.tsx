import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const Profile = () => {
  return (
    <div className="min-h-screen py-20 bg-gray-200">
      <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
        <TabsList className="flex justify-center bg-transparent gap-4 mb-8">
          <TabsTrigger
            value="profile"
            className="px-8 py-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="px-8 py-2 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
          >
            Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8 tracking-tight">
              Update Profile
            </h1>

            <div className="flex flex-col md:flex-row justify-center items-start gap-12 w-full">
              <div className="flex flex-col items-center space-y-4 min-w-[200px]">
                <div className="relative group">
                  <img
                    className="object-cover object-top shadow-2xl rounded-full w-[160px] h-[160px] ring-4 ring-pink-400 ring-offset-4 transition-transform duration-300 group-hover:scale-105"
                    src="./profileImage.jpg"
                    alt="imageProfile"
                  />
                </div>
                <Button
                  variant="outline"
                  className="text-pink-600 border-pink-200 hover:bg-pink-50"
                >
                  Change Photo
                </Button>
              </div>

              <form className="flex-1 space-y-6 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-gray-600 font-semibold"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      className="focus-visible:ring-pink-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-gray-600 font-semibold"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      className="focus-visible:ring-pink-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-gray-600 font-semibold"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.com"
                    className="focus-visible:ring-pink-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-gray-600 font-semibold"
                  >
                    Address
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="123 Street Name"
                    className="focus-visible:ring-pink-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="city"
                      className="text-gray-600 font-semibold"
                    >
                      City
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Cairo"
                      className="focus-visible:ring-pink-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="zipCode"
                      className="text-gray-600 font-semibold"
                    >
                      Zip Code
                    </Label>
                    <Input
                      id="zipCode"
                      type="text"
                      placeholder="11511"
                      className="focus-visible:ring-pink-400"
                    />
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-6 rounded-xl transition-all shadow-lg shadow-pink-200">
                  Update Profile
                </Button>
              </form>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8 tracking-tight">
              Order History
            </h1>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="w-[150px] font-semibold uppercase text-xs tracking-wider text-gray-500">
                      Order ID
                    </TableHead>
                    <TableHead className="font-semibold uppercase text-xs tracking-wider text-gray-500">
                      Date
                    </TableHead>
                    <TableHead className="font-semibold uppercase text-xs tracking-wider text-gray-500">
                      Status
                    </TableHead>
                    <TableHead className="text-right font-semibold uppercase text-xs tracking-wider text-gray-500">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Row 1 */}
                  <TableRow className="hover:bg-gray-50 transition-colors">
                    <TableCell className="py-4 font-medium text-blue-600">
                      #ORD-7721
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-500">
                      Jan 12, 2026
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">
                        Delivered
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-right font-bold text-gray-900">
                      $129.00
                    </TableCell>
                  </TableRow>

                  {/* Row 2 */}
                  <TableRow className="hover:bg-gray-50 transition-colors">
                    <TableCell className="py-4 font-medium text-blue-600">
                      #ORD-8812
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-500">
                      Jan 05, 2026
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-700">
                        Processing
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-right font-bold text-gray-900">
                      $45.50
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
