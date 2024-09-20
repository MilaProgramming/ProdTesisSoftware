
# Class for defining the binary tree, having already defined the node
from Classes.Node import Node 

class BinaryTree:
    def __init__(self):
        self.root = None

    def insert(self, data):
        if self.root is None:
            self.root = Node(data)  # If the tree is empty, we create the root
        else:
            self._insert_recursive(self.root, data)  
    
    def _insert_recursive(self, current_node, data):
        if data < current_node.data:
            if current_node.left is None:
                current_node.left = Node(data)  # Insert to the left if there's no left child
            else:
                self._insert_recursive(current_node.left, data)  # Let's keep going down the left subtree
                
        elif data > current_node.data:
            if current_node.right is None:
                current_node.right = Node(data)  # Insert to the right if there's no right child
            else:
                self._insert_recursive(current_node.right, data)  # Let's keep going down the right subtree
        
        # If data equals current_node.data, we won't insert duplicates
    
    def in_order_traversal(self):
        nodes = []
        self._in_order_recursive(self.root, nodes)
        return nodes

    def _in_order_recursive(self, current_node, nodes):
        if current_node is not None:
            self._in_order_recursive(current_node.left, nodes)  # All the way to the left
            nodes.append(current_node.data)  # Visit the nodes     
            self._in_order_recursive(current_node.right, nodes)  # All the way to the right
            