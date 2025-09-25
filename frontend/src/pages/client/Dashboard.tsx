import {
  Box,
  Heading,
  VStack,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Text,
  HStack,
  StackDivider,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import TaskSubmissionForm from '../../components/client/TaskSubmissionForm';
import ReviewForm from '../../components/client/ReviewForm';
import SupportChat from '../../components/client/SupportChat';
import axios from 'axios';

// Placeholder data for tasks
const tasks = [
  { id: 1, title: 'Website Redesign', freelancer: 'John Doe', status: 'In Progress', deadline: '2024-07-15' },
  { id: 2, title: 'Mobile App Development', freelancer: 'Jane Smith', status: 'Pending', deadline: '2024-08-01' },
  { id: 3, title: 'SEO Optimization', freelancer: 'David Lee', status: 'Completed', deadline: '2024-06-30' },
];

// Placeholder data for invoices
const invoices = [
  { id: 101, project: 'Website Redesign', amount: 500, status: 'Due' },
  { id: 102, project: 'Mobile App Development', amount: 1000, status: 'Paid' },
];

export default function ClientDashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const toast = useToast();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleMarkComplete = () => {
    onOpen()
  };

  const confirmMarkComplete = () => {
    // TODO: Implement mark as complete logic, generate invoice, and redirect to payment
    onClose();
    toast({
      title: 'Project marked as complete!',
      description: 'An invoice has been generated. Redirecting to payment gateway...',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleRequestRevision = () => {
    // TODO: Implement request revision logic
    alert('Revision requested!');
  };

  const handleViewDetails = (taskId) => {
    // TODO: Implement view details logic, navigate to task details page
    alert(`Viewing details for task ${taskId}`);
  };

  const handleChatWithExpert = (taskId) => {
    // TODO: Implement chat with expert logic, open chat interface
    alert(`Opening chat with expert for task ${taskId}`);
  };

  const handleLeaveReview = (project) => {
    setSelectedProject(project);
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedProject(null);
  };

  const submitReview = (reviewData) => {
    // TODO: Implement submit review logic
    console.log('Review Data:', reviewData);
    handleCloseReviewModal();
    toast({
      title: 'Review submitted!',
      description: 'Thank you for your feedback.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };





















































































































































































  const handlePayNow = async (invoice) => {
    setPaymentError(null);
    try {
      const response = await axios.post('/api/payments/paypal/order/create/', { amount: invoice.amount });
      if (response.data.success) {
        // Redirect to PayPal payment page
        window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${response.data.order_id}`;
      } else {
        setPaymentError(response.data.error || 'Failed to create PayPal order.');
      }
    } catch (error) {
      setPaymentError('Failed to connect to payment gateway.');
      console.error(error);
    }
  };

  return (

    <Box p={6}>
      <Heading size="lg" mb={4}>Client Dashboard</Heading>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        {/* Task Submission Widget */}
        <GridItem colSpan={2}>
          <Card>
            <CardHeader>
              <Heading size="md">Submit a New Task</Heading>
            </CardHeader>
            <CardBody>
              <TaskSubmissionForm onSubmit={() =>
                toast({
                  title: 'Task submitted',
                  description: 'Your task has been submitted for review.',
                  status: 'success',
                  duration: 4000,
                  isClosable: true,
                })
              } />
            </CardBody>
          </Card>
        </GridItem>
        {/* Task Tracking Widget */}
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Card>
            <CardHeader>
              <Heading size="md">Task Tracking</Heading>
            </CardHeader>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Project Title</Th>
                    <Th>Freelancer</Th>
                    <Th>Status</Th>
                    <Th>Deadline</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tasks.map((task) => (
                    <Tr key={task.id}>
                      <Td>{task.title}</Td>
                      <Td>{task.freelancer}</Td>
                      <Td>{task.status}</Td>
                      <Td>{task.deadline}</Td>
                      <Td>
                        {task.status !== 'Completed' && (
                          <HStack spacing={2}>
                            <Button size="sm" colorScheme="blue" onClick={() => handleViewDetails(task.id)}>View Details</Button>
                            <Button size="sm" colorScheme="green" onClick={() => handleChatWithExpert(task.id)}>Chat with Expert</Button>
                          </HStack>
                        )}
                        {task.status === 'Completed' && (
                          <Button size="sm" colorScheme="purple" onClick={() => handleLeaveReview(task)}>Leave Review</Button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </GridItem>

        {/* AI Chatbots Widget */}
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Card>
            <CardHeader>
              <Heading size="md">AI Chatbots</Heading>
            </CardHeader>
            <CardBody>
              <Tabs>
                <TabList>
                  <Tab>Chat with Expert</Tab>
                  <Tab>Admin & Support</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Text>Placeholder for Chat with Expert UI</Text>
                    {/* TODO: Implement Chat with Expert UI */}
                  </TabPanel>
                  <TabPanel>
                    <SupportChat />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </GridItem>

        {/* Payment and Billing Widget */}
        <GridItem colSpan={2}>
          <Card>
            <CardHeader>
              <Heading size="md">Payment and Billing</Heading>
            </CardHeader>
            <CardBody>
      <VStack spacing={4} align="stretch">















                <Heading size="sm">Billing/Invoice</Heading>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Invoice ID</Th>
                      <Th>Project Name</Th>
                      <Th>Amount</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {invoices.map((invoice) => (
                      <Tr key={invoice.id}>
                        <Td>{invoice.id}</Td>
                        <Td>{invoice.project}</Td>
                        <Td>{invoice.amount}</Td>
                        <Td>{invoice.status}</Td>
                        <Td>
                          {invoice.status === 'Due' && (
                            <Button size="sm" colorScheme="green" onClick={() => handlePayNow(invoice)}>Pay Now</Button>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Heading size="sm">Real-time Tracker</Heading>
                <HStack spacing={4} divider={<StackDivider borderColor="gray.200" />}>
                  <Box>
                    <Text fontWeight="bold">Total Spent:</Text>
                    <Text>$1500</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Active Projects:</Text>
                    <Text>2</Text>
                  </Box>
                </HStack>
      </VStack>

              {paymentError && (
                <Alert status="error">
                  <AlertIcon />
                  {paymentError}
                </Alert>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Project Management Controls - Example within Task Tracking Widget */}
      {/* Feedback/Review/Dispute System - Review Modal */}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Mark Project as Complete?
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to mark this project as complete? This will approve the final payment and generate the invoice.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={confirmMarkComplete} ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal isOpen={showReviewModal} onClose={handleCloseReviewModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leave a Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ReviewForm onSubmit={submitReview} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseReviewModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
}



