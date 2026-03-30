import { db } from "../firebase";
import { collection, query, where, getDocs, runTransaction, doc, getDoc } from "firebase/firestore";

export async function assignAccountToUser(userId: string, subscriptionId: string) {
  try {
    // 1. Find an available account outside the transaction
    const accountsRef = collection(db, "access_accounts");
    const q = query(accountsRef, where("status", "==", "active"));
    const querySnapshot = await getDocs(q);
    
    let candidateAccountId = null;
    let candidateAccountRef = null;

    for (const accountDoc of querySnapshot.docs) {
      const data = accountDoc.data();
      if (data.currentUsers < data.maxUsers) {
        candidateAccountId = accountDoc.id;
        candidateAccountRef = doc(db, "access_accounts", candidateAccountId);
        break;
      }
    }

    if (!candidateAccountId || !candidateAccountRef) {
      throw new Error("No available accounts in the pool. Please contact support.");
    }

    // 2. Run the transaction to assign the account
    await runTransaction(db, async (transaction) => {
      const subRef = doc(db, "subscriptions", subscriptionId);
      const subDoc = await transaction.get(subRef);
      
      if (!subDoc.exists()) {
        throw new Error("Subscription not found");
      }
      
      if (subDoc.data().assignedAccountId) {
        // Already assigned
        return;
      }

      const accountDoc = await transaction.get(candidateAccountRef);
      if (!accountDoc.exists()) {
        throw new Error("Account no longer exists");
      }
      
      const accountData = accountDoc.data();
      if (accountData.currentUsers >= accountData.maxUsers) {
        throw new Error("Account filled up during assignment. Please refresh to try again.");
      }

      const newAssignedUsers = [...(accountData.assignedUsers || []), userId];
      
      transaction.update(candidateAccountRef, {
        currentUsers: accountData.currentUsers + 1,
        assignedUsers: newAssignedUsers
      });

      transaction.update(subRef, {
        assignedAccountId: candidateAccountId
      });
    });
    
    return true;
  } catch (error) {
    console.error("Error assigning account:", error);
    throw error;
  }
}

export async function revokeAccountFromUser(userId: string, subscriptionId: string, accountId: string) {
  try {
    await runTransaction(db, async (transaction) => {
      const subRef = doc(db, "subscriptions", subscriptionId);
      const accountRef = doc(db, "access_accounts", accountId);

      const [subDoc, accountDoc] = await Promise.all([
        transaction.get(subRef),
        transaction.get(accountRef)
      ]);

      if (subDoc.exists() && subDoc.data().assignedAccountId === accountId) {
        transaction.update(subRef, {
          assignedAccountId: null
        });
      }

      if (accountDoc.exists()) {
        const accountData = accountDoc.data();
        const newAssignedUsers = (accountData.assignedUsers || []).filter((id: string) => id !== userId);
        
        transaction.update(accountRef, {
          currentUsers: Math.max(0, newAssignedUsers.length),
          assignedUsers: newAssignedUsers
        });
      }
    });
    return true;
  } catch (error) {
    console.error("Error revoking account:", error);
    throw error;
  }
}
